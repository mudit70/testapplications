"""Repository module — imported functions that talk to SQLAlchemy directly.

Used by F8 (be-modulefn): a path operation function imports and calls one of
these functions, which run the actual session.query / session.add work.
"""

from sqlalchemy.orm import Session

from .models import Comment, Ticket


def list_comments_for_ticket(db: Session, ticket_id: int):
    # session.query(...).filter(...).all() — read on `comments`
    return db.query(Comment).filter(Comment.ticket_id == ticket_id).all()


def add_comment(db: Session, ticket_id: int, author: str, body: str):
    # session.add + commit — write on `comments`
    comment = Comment(ticket_id=ticket_id, author=author, body=body)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def count_open_tickets(db: Session):
    # session.query(...).filter(...) — read on `tickets`
    return db.query(Ticket).filter(Ticket.status == "open").count()
