use std::ops::Add;
use std::time::Duration;
use std::time::SystemTime;

use diesel::*;
use tonic::{Code, Request, Response, Status};

use crate::auth;
use crate::db_connection::*;
use crate::protos::*;
use crate::schema::user_refresh_tokens;

pub fn access_token(
    request: Request<AccessTokenRequest>,
    conn: &mut PgPooledConnection,
) -> Result<Response<AccessTokenResponse>, Status> {
    log::info!("AccessToken called.");
    let requested_token = &request.into_inner().refresh_token;
    let token_user_expiry: Result<(i64, i64, Option<SystemTime>), _> = user_refresh_tokens::table
        .select((
            user_refresh_tokens::id,
            user_refresh_tokens::user_id,
            user_refresh_tokens::expires_at,
        ))
        .filter(user_refresh_tokens::token.eq(requested_token))
        .first::<(i64, i64, Option<SystemTime>)>(conn);

    const LIFETIME_DAYS: u64 = 7;
    const RENEWAL_PERIOD_DAYS: u64 = 3;
    match token_user_expiry {
        Err(_) => {
            log::warn!("Auth token {} not found.", requested_token);
            Err(Status::new(Code::Unauthenticated, "not_authorized"))
        }
        Ok((refresh_token_id, user_id, expires_at)) => match expires_at {
            Some(t) if t > SystemTime::now() => {
                log::warn!("Attempt to use expired refresh token. refresh_token_id={}, user_id={}", refresh_token_id, user_id);
                Err(Status::new(Code::Unauthenticated, "not_authorized"))
            }
            Some(t)
                if t < SystemTime::now()
                    && t.add(Duration::from_secs(60 * 60 * 24 * RENEWAL_PERIOD_DAYS))
                        > SystemTime::now() =>
            {
                log::info!(
                    "Updating refresh token for user_id={}, generating access token...",
                    user_id
                );
                let new_expiry =
                    SystemTime::now().add(Duration::from_secs(60 * 60 * 24 * LIFETIME_DAYS));
                let new_token_pair =
                    auth::generate_refresh_and_access_token(user_id, conn, Some(new_expiry.into()));
                Ok(Response::new(AccessTokenResponse {
                    access_token: new_token_pair.access_token,
                    refresh_token: new_token_pair.refresh_token,
                }))
            }
            None => {
                log::warn!(
                    "Non-expiring refresh token for user_id={}, generating access token...",
                    user_id
                );
                let access_token = auth::generate_access_token(refresh_token_id, conn);
                Ok(Response::new(AccessTokenResponse {
                    access_token: Some(access_token),
                    refresh_token: None,
                }))
            }
            _ => {
                log::debug!("Generating access token for user_id={}", user_id);
                let access_token = auth::generate_access_token(refresh_token_id, conn);
                Ok(Response::new(AccessTokenResponse {
                    access_token: Some(access_token),
                    refresh_token: None,
                }))
            }
        }
    }
}
