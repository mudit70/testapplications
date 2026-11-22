# Rust + React Todo (analyzer fixture)

A small, idiomatic fixture app for testing a static analyzer's ability to
stitch **React frontend → Rust backend route → handler → Postgres** flows.

- **Frontend:** React + Vite + TypeScript (`frontend/`), plain `fetch` calls.
- **Backend:** Rust + Axum + sqlx (`backend/`), one DB query per handler.
- **Database:** Postgres — `users` and `todos` tables (`backend/migrations/`).

> This is an analysis fixture. Source is idiomatic and statically parseable but
> is not guaranteed to compile/run without a live database (sqlx macros need
> `DATABASE_URL` at build time).

## End-to-end flows (ground truth)

| User action | Frontend call | Backend route | Handler | DB |
|-------------|---------------|---------------|---------|----|
| Page load — list todos | `GET /api/todos` (`fetchTodos`, `TodoList.tsx`) | `GET /api/todos` | `list_todos` | `SELECT` from `todos` |
| Click "Add Todo" (form submit) | `POST /api/todos` (`createTodo`, `TodoList.tsx`) | `POST /api/todos` | `create_todo` | `INSERT` into `todos` |
| Toggle completed checkbox | `PUT /api/todos/:id` (`updateTodo`, `TodoList.tsx`) | `PUT /api/todos/:id` | `update_todo` | `UPDATE` `todos` |
| Click "Delete" | `DELETE /api/todos/:id` (`deleteTodo`, `TodoList.tsx`) | `DELETE /api/todos/:id` | `delete_todo` | `DELETE` from `todos` |
| Load user profile | `GET /api/users/:id` (`fetchUser`, `UserProfile.tsx`) | `GET /api/users/:id` | `get_user` | `SELECT` from `users` |

## Layout

```
backend/
  Cargo.toml
  migrations/0001_init.sql
  src/{main.rs, handlers.rs, models.rs}
frontend/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  src/{main.tsx, App.tsx, api.ts, components/{TodoList.tsx, UserProfile.tsx}}
```
