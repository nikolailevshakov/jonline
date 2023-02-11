use std::path::*;
use rocket::fs::*;
use rocket_cache_response::CacheResponse;


use rocket::http::Status;

#[rocket::get("/<file..>")]
pub async fn tamagui_file_or_username(file: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    log::info!("tamagui_file_or_username: {:?}", file);
    let result = match NamedFile::open(Path::new("opt/tamagui_web/").join(file.to_owned())).await {
        Ok(file) => Ok(file),
        Err(_) => match NamedFile::open(Path::new("../frontends/tamagui/apps/next/out/").join(file)).await {
            Ok(file) => Ok(file),
            Err(_) => return tamagui_path("[username].html").await
        },
    };
    CacheResponse::Public {
        responder: result,
        max_age: 60,
        must_revalidate: false,
    }
}

#[rocket::get("/tamagui")]
pub async fn tamagui_index() -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("index.html").await
}

#[rocket::get("/post/<_id_etc..>")]
pub async fn tamagui_post(_id_etc: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("post/[postId].html").await
}

#[rocket::get("/user/<_id_etc..>")]
pub async fn tamagui_user(_id_etc: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("user/[id].html").await
}

#[rocket::get("/g/<_shortname>/p/<_id_etc..>")]
pub async fn tamagui_group_post(_shortname: PathBuf, _id_etc: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("g/[shortname]/p/[postId].html").await
}

#[rocket::get("/g/<_shortname>")]
pub async fn tamagui_group_shortname(_shortname: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("g/[shortname].html").await
}

#[rocket::get("/server/<_id_etc..>")]
pub async fn tamagui_server(_id_etc: PathBuf) -> CacheResponse<Result<NamedFile, Status>> {
    tamagui_path("server/[id].html").await
}

async fn tamagui_path(path: &str) -> CacheResponse<Result<NamedFile, Status>> {
    let result = match NamedFile::open(format!("opt/tamagui_web/{}", path)).await {
        Ok(file) => Ok(file),
        Err(_) => match NamedFile::open(format!("../frontends/tamagui/apps/next/out/{}", path)).await {
            Ok(file) => Ok(file),
            Err(e) => Err(e),
        },
    };
    CacheResponse::Public {
        responder: result.map_err(|e| {
            log::info!("tamagui_path: {:?}", e);
            Status::NotFound
        }),
        max_age: 60,
        must_revalidate: false,
    }
}