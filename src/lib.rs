use wasm_bindgen::prelude::*;
use web_sys::console;

mod crypto;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn sm3() -> String {
    console::log_1(&JsValue::from_str("invoked sm3"));
    let str = crypto::sm3::sm3_hash("abc".as_bytes());
    console::log_1(&JsValue::from_str(&str));
    str
}
// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();


    // Your code goes here!
    console::log_1(&JsValue::from_str("sm-crypto-wasm 0.0.1 initialized."));

    Ok(())
}
