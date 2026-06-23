// Google Cloud Storage snapshot export (google-cloud-storage).

use google_cloud_storage::client::Client;
use google_cloud_storage::http::objects::download::Range;
use google_cloud_storage::http::objects::get::GetObjectRequest;
use google_cloud_storage::http::objects::upload::{Media, UploadObjectRequest, UploadType};

pub async fn export_snapshot(client: &Client, dashboard_id: i64, body: Vec<u8>) {
    let upload_type = UploadType::Simple(Media::new(format!("snapshots/{}.json", dashboard_id)));
    client
        .upload_object(
            &UploadObjectRequest {
                bucket: "metrics-snapshots".to_string(),
                ..Default::default()
            },
            body,
            &upload_type,
        )
        .await
        .unwrap();
}

pub async fn fetch_snapshot(client: &Client, dashboard_id: i64) -> Vec<u8> {
    client
        .download_object(
            &GetObjectRequest {
                bucket: "metrics-snapshots".to_string(),
                object: format!("snapshots/{}.json", dashboard_id),
                ..Default::default()
            },
            &Range::default(),
        )
        .await
        .unwrap()
}
