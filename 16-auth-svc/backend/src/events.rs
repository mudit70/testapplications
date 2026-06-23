// Realtime session-event websocket using tokio-tungstenite (ws-rs).
use tokio::net::TcpStream;
use tokio_tungstenite::{accept_async, connect_async};

pub async fn handle_session_socket(stream: TcpStream) -> anyhow::Result<()> {
    let _ws = accept_async(stream).await?;
    Ok(())
}

pub async fn dial_event_bus() -> anyhow::Result<()> {
    let _ = connect_async("ws://events.example.com/sessions").await?;
    Ok(())
}
