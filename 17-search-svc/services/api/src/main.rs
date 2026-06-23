#[macro_use]
extern crate rocket;

mod routes;
mod db;
mod events;
mod search;

use rocket::routes;

#[launch]
fn rocket() -> _ {
    rocket::build().mount(
        "/api",
        routes![
            routes::search_docs,
            routes::get_doc,
            routes::index_doc,
        ],
    )
}
