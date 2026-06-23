"""SQLAlchemy ORM models for the helpdesk domain."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    tickets = relationship("Ticket", back_populates="assignee")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    body = Column(Text)
    status = Column(String, default="open")
    priority = Column(String, default="normal")
    assignee_id = Column(Integer, ForeignKey("agents.id"))
    created_at = Column(DateTime)
    assignee = relationship("Agent", back_populates="tickets")
    comments = relationship("Comment", back_populates="ticket")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    author = Column(String)
    body = Column(Text)
    created_at = Column(DateTime)
    ticket = relationship("Ticket", back_populates="comments")
