extern crate anyhow;
extern crate diesel;
extern crate jonline;

use std::path::PathBuf;
use std::thread;
use std::time::Duration;

use diesel::*;
use headless_chrome::protocol::cdp::Page::CaptureScreenshotFormatOption::*;
use headless_chrome::{protocol::cdp::Target::CreateTarget, Browser};

use jonline::conversions::ToLink;
use jonline::db_connection;
use jonline::models::Post;
use jonline::schema::posts::dsl::*;

pub fn main() {
    println!("Generating preview images...");
    println!("Connecting to DB...");
    let mut conn = db_connection::establish_connection();

    println!("Starting browser...");
    let browser = start_browser().expect("Failed to start browser");

    let posts_to_update = posts
        .filter(preview.is_null())
        .filter(link.is_not_null())
        .limit(100)
        .load::<Post>(&mut conn)
        .unwrap();
    println!("Got {} posts to update.", posts_to_update.len());

    for post in posts_to_update {
        update_post(&post, &browser, &mut conn);
    }

    println!("Done generating preview images.");
}

fn update_post(post: &Post, browser: &Browser, conn: &mut PgConnection) {
    println!("Generating preview image for post: {}", post.id);
    match post.link.to_link() {
        None => println!("Invalid link: {:?}", post.link),
        Some(url) => {
            match generate_preview(&url, &browser) {
                Ok(screenshot) => {
                    println!(
                        "Generated screenshot for link {}, post {}! {} bytes",
                        url,
                        post.id,
                        screenshot.len()
                    );
                    update(posts)
                        .filter(id.eq(post.id))
                        .set(preview.eq(screenshot))
                        .execute(conn)
                        .unwrap();
                }
                Err(e) => {
                    println!("Failed to generate screenshot for link {}: {}", url, e);
                }
            };
        }
    }

}

fn generate_preview(url: &str, browser: &Browser) -> Result<Vec<u8>, anyhow::Error> {
    let tab = browser.new_tab_with_options(CreateTarget {
        url: url.to_string(),
        background: Some(true),
        new_window: Some(true),
        width: Some(640),
        height: Some(640),
        browser_context_id: None,
        enable_begin_frame_control: None,
    })?;
    tab.navigate_to(&url)?;
    tab.wait_until_navigated()?;
    // Allow time for client-side page rendering and extensions to work.
    thread::sleep(Duration::from_secs(10));
    let result = tab.capture_screenshot(Png, None, None, false)?;
    tab.close(true)?;
    return Ok(result);
}

fn start_browser() -> Result<Browser, anyhow::Error> {
    let options = headless_chrome::LaunchOptionsBuilder::default()
        .path(Some(PathBuf::from("/usr/bin/brave-browser")))
        .headless(false)
        .disable_default_args(true)
        .sandbox(false)
        .args(
            [
                std::ffi::OsStr::new("--headless=chrome"),
                std::ffi::OsStr::new("--hide-scrollbars"),
                std::ffi::OsStr::new("--lang=en_US"),

                // Default args but with extensions enabled
                std::ffi::OsStr::new("--disable-background-networking"),
                std::ffi::OsStr::new("--enable-features=NetworkService,NetworkServiceInProcess"),
                std::ffi::OsStr::new("--disable-background-timer-throttling"),
                std::ffi::OsStr::new("--disable-backgrounding-occluded-windows"),
                std::ffi::OsStr::new("--disable-breakpad"),
                std::ffi::OsStr::new("--disable-client-side-phishing-detection"),
                // std::ffi::OsStr::new("--disable-component-extensions-with-background-pages"),
                std::ffi::OsStr::new("--disable-default-apps"),
                std::ffi::OsStr::new("--disable-dev-shm-usage"),
                //    std::ffi::OsStr::new( "--disable-extensions"),
                // BlinkGenPropertyTrees disabled due to crbug.com/937609
                std::ffi::OsStr::new("--disable-features=TranslateUI,BlinkGenPropertyTrees"),
                std::ffi::OsStr::new("--disable-hang-monitor"),
                std::ffi::OsStr::new("--disable-ipc-flooding-protection"),
                // std::ffi::OsStr::new("--disable-popup-blocking"),
                std::ffi::OsStr::new("--disable-prompt-on-repost"),
                std::ffi::OsStr::new("--disable-renderer-backgrounding"),
                std::ffi::OsStr::new("--disable-sync"),
                std::ffi::OsStr::new("--force-color-profile=srgb"),
                std::ffi::OsStr::new("--metrics-recording-only"),
                std::ffi::OsStr::new("--no-first-run"),
                std::ffi::OsStr::new("--enable-automation"),
                std::ffi::OsStr::new("--password-store=basic"),
                std::ffi::OsStr::new("--use-mock-keychain"),
            ]
            .to_vec(),
        )
        .extensions(
            [
                std::ffi::OsStr::new("/opt/preview_generator_extensions/ublock/"),
                std::ffi::OsStr::new("/opt/preview_generator_extensions/nocookies/"),
            ]
            .to_vec(),
        )
        .window_size(Some((640, 640)))
        .build()
        .unwrap();
    Ok(Browser::new(options)?)
    // Browser::connect("ws://0.0.0.0:9222".to_string())
}