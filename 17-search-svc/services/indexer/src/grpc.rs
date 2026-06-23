// tonic gRPC — exposes index status to other services.
use tonic::transport::Server;

use crate::store;

// Generated-stub stand-ins (normally produced by tonic-build from a
// .proto). Kept minimal so the visitor sees the canonical idioms.
pub mod index_status {
    pub mod index_status_server {
        pub trait IndexStatus {}
    }
}

pub struct StatusRequest {
    pub doc_id: String,
}
pub struct StatusReply {
    pub indexed: bool,
    pub total: u64,
}
pub struct SummaryRequest {}
pub struct SummaryReply {
    pub total: u64,
}

#[derive(Default)]
pub struct IndexStatusService {}

#[tonic::async_trait]
impl index_status::index_status_server::IndexStatus for IndexStatusService {
    async fn doc_status(
        &self,
        request: tonic::Request<StatusRequest>,
    ) -> Result<tonic::Response<StatusReply>, tonic::Status> {
        let id = request.into_inner().doc_id;
        let indexed = store::find_doc(&id).await.unwrap_or(false);
        let total = store::count_docs().await.unwrap_or(0);
        Ok(tonic::Response::new(StatusReply { indexed, total }))
    }

    async fn summary(
        &self,
        _request: tonic::Request<SummaryRequest>,
    ) -> Result<tonic::Response<SummaryReply>, tonic::Status> {
        let total = store::count_docs().await.unwrap_or(0);
        Ok(tonic::Response::new(SummaryReply { total }))
    }
}

pub async fn serve() -> anyhow::Result<()> {
    let addr = "0.0.0.0:50051".parse()?;
    let svc = IndexStatusService::default();
    Server::builder()
        .add_service(make_service(svc))
        .serve(addr)
        .await?;
    Ok(())
}

// In a real build this is the generated `IndexStatusServer::new`.
fn make_service(svc: IndexStatusService) -> IndexStatusService {
    svc
}
