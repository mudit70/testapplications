import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.api import deps
from app.models import Item, ItemCreate, User
from app.utils import send_alert

router = APIRouter(prefix="/items", tags=["items"])


@router.post("/")
def create_item(
    *, session: deps.SessionDep, current_user: deps.CurrentUser, item_in: ItemCreate
) -> Item:
    item = Item.model_validate(item_in, update={"owner_id": current_user.id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{id}")
def delete_item(
    session: deps.SessionDep,
    current_user: Annotated[User, Depends(deps.get_current_user)],
    id: uuid.UUID,
) -> dict:
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != current_user.id:
        send_alert(f"user {current_user.id} tried to delete item {id}")
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(item)
    session.commit()
    return {"message": "Item deleted"}
