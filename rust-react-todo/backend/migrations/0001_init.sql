-- Initial schema: users and todos.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE todos (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title      TEXT NOT NULL,
    completed  BOOLEAN NOT NULL DEFAULT false,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
