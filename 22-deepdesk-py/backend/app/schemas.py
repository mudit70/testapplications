"""Pydantic request/response schemas."""

from typing import Optional

from pydantic import BaseModel


class TicketCreate(BaseModel):
    subject: str
    body: str
    priority: str = "normal"


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[int] = None


class AgentCreate(BaseModel):
    name: str
    email: str


class CommentCreate(BaseModel):
    author: str
    body: str
