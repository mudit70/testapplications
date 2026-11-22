use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// A single todo item, mapped to the `todos` table.
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Todo {
    pub id: Uuid,
    pub title: String,
    pub completed: bool,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
}

/// An application user, mapped to the `users` table.
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
}

/// Request body for creating a todo.
#[derive(Debug, Deserialize)]
pub struct CreateTodo {
    pub title: String,
    pub user_id: Uuid,
}

/// Request body for updating a todo.
#[derive(Debug, Deserialize)]
pub struct UpdateTodo {
    pub title: Option<String>,
    pub completed: Option<bool>,
}
