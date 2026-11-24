# 32-py-fastapi-sqlmodel — FastAPI dependencies, SQLModel sessions and mail

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. It
has the shapes of full-stack-fastapi-template's backend.

| Route | Runs before the handler | Data | Out |
| --- | --- | --- | --- |
| POST /api/users/ | `dependencies=[Depends(get_current_active_superuser)]`, whose `CurrentUser` runs `get_current_user`; `SessionDep` | `crud.create_user`: `User.model_validate` then `session.add` | `send_email` through `emails`, host `settings.SMTP_HOST` (Unknown) |
| PATCH /api/users/me | `SessionDep`, `CurrentUser` | `session.add(current_user)` | |
| DELETE /api/users/me | `SessionDep`, `CurrentUser` | `session.delete(current_user)` | |
| POST /api/items/ | `deps.SessionDep`, `deps.CurrentUser` (aliases read through the module) | `Item.model_validate` then `session.add` | |
| DELETE /api/items/{id} | `deps.SessionDep`, inline `Annotated[User, Depends(deps.get_current_user)]` | `session.get`, `session.delete` | `send_alert` through `smtplib` to `smtp.ops.example.com` |
