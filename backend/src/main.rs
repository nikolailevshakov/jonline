#[macro_use]
extern crate diesel;
extern crate async_compression;
extern crate bcrypt;
extern crate bs58;
extern crate diesel_migrations;
extern crate dotenv;
extern crate env_logger;
extern crate futures;
extern crate itertools;
extern crate log;
extern crate prost_types;
extern crate prost_wkt_types;
extern crate regex;
extern crate ring;
extern crate rocket;
extern crate rocket_async_compression;
extern crate rocket_cache_response;
extern crate serde;
extern crate serde_json;
extern crate tonic_web;
extern crate uuid;
#[macro_use]
extern crate lazy_static;
extern crate awscreds;
extern crate awsregion;
extern crate bytes;
extern crate percent_encoding;
extern crate s3;
extern crate tempfile;
extern crate tokio_stream;

pub mod auth;
pub mod db_connection;
pub mod jonline;
pub mod logic;
pub mod marshaling;
pub mod minio_connection;
pub mod models;
pub mod protos;
pub mod rpcs;
pub mod schema;
pub mod servers;
pub mod web;

use ::jonline::{env_var, init_service_logging, report_error};
use futures::future::join_all;
use servers::{start_rocket_secure, start_rocket_unsecured, start_tonic_server};
use std::sync::Arc;

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_service_logging();
    db_connection::migrate_database();

    let pool = Arc::new(db_connection::establish_pool());
    let bucket = Arc::new(
        minio_connection::get_and_test_bucket()
            .await
            .expect("Failed to connect to MinIO"),
    );

    let tempdir = Arc::new(tempfile::tempdir().map_err(|e| {
        log::error!("Failed to create tempdir: {:?}", e);
        e
    })?);

    // Ideally, we should be able to restart servers and switch between HTTPS redirects.
    let mut conn = pool
        .get()
        .expect("Failed to get connection trying to load server configuration");
    let server_configuration = rpcs::get_server_configuration(&mut conn)
        .or_else(|_| {
            log::warn!("Failed to load server configuration, regenerating...");
            rpcs::create_default_server_configuration(&mut conn)
        })
        .expect("Failed to load or regenerate server configuration");

    let external_cdn_config = server_configuration.external_cdn_config;

    let tls_configuration_successful = start_tonic_server(pool.clone(), bucket.clone())?;

    let rocket_secure = start_rocket_secure(pool.clone(), bucket.clone(), tempdir.clone());
    let rocket_unsecure_80 = start_rocket_unsecured(
        80,
        pool.clone(),
        bucket.clone(),
        tempdir.clone(),
        tls_configuration_successful,
        external_cdn_config.is_some(),
    );
    let rocket_unsecure_8000 = start_rocket_unsecured(
        8000,
        pool.clone(),
        bucket.clone(),
        tempdir.clone(),
        tls_configuration_successful,
        external_cdn_config.is_some(),
    );

    join_all::<_>([
        // tonic_server,
        rocket_secure,
        rocket_unsecure_80,
        rocket_unsecure_8000,
    ])
    .await;

    Ok(())
}
