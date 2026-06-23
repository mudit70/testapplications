// Session cache backed by memcached (memcache crate).
use memcache::Client;

pub fn cache_session(client: &Client, token: &str) -> anyhow::Result<()> {
    client.set("session:current", token, 3600)?;
    Ok(())
}

pub fn get_session(client: &Client) -> anyhow::Result<()> {
    let _: Option<String> = client.get("session:current")?;
    Ok(())
}

pub fn drop_session(client: &Client) -> anyhow::Result<()> {
    client.delete("session:current")?;
    Ok(())
}
