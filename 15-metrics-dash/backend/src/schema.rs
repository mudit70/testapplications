// Diesel schema for the metrics dashboard.

use diesel::prelude::*;

diesel::table! {
    dashboards (id) {
        id    -> BigInt,
        name  -> Text,
        owner -> Text,
    }
}

diesel::table! {
    metrics (id) {
        id           -> BigInt,
        dashboard_id -> BigInt,
        name         -> Text,
        value        -> Double,
    }
}
