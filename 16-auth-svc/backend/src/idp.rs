// Outbound HTTP to an external identity provider via reqwest.
use reqwest::Client;

pub async fn verify_credentials(client: &Client, email: &str) -> anyhow::Result<()> {
    // POST to the external IdP to validate credentials.
    let _ = client
        .post("https://idp.example.com/oauth/token")
        .send()
        .await?;
    let _ = email;
    Ok(())
}

pub async fn fetch_userinfo(client: &Client) -> anyhow::Result<()> {
    // GET the userinfo endpoint after login.
    let _ = client
        .get("https://idp.example.com/oauth/userinfo")
        .send()
        .await?;
    Ok(())
}
