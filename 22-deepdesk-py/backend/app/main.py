"""FastAPI application entrypoint.

All path operations are declared directly on the app with their full literal
path (e.g. @app.get("/api/f1")), the pattern adorable complete-stitches most
reliably. The experiment endpoints F1-F9 live here; F1-F6 hold BACKEND=inline,
F7-F9 vary the backend dispatch rung:

  F7 be-localfn     — path fn -> same-file function -> SQLAlchemy
  F8 be-modulefn    — path fn -> imported repository function -> SQLAlchemy
  F9 be-classmethod — path fn -> service class instance method -> SQLAlchemy

The caller URL literal in the frontend matches each path here exactly.
"""

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Agent, Comment, Ticket
from .repository import (
    add_comment,
    count_open_tickets,
    list_comments_for_ticket,
)
from .schemas import AgentCreate, CommentCreate, TicketCreate, TicketUpdate
from .services import agent_service

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DeepDesk")


@app.get("/health")
def health():
    return {"ok": True}


# ── Experiment F1-F6: backend inline (path fn -> SQLAlchemy directly) ──

@app.get("/api/f1")
def f1_list_tickets(db: Session = Depends(get_db)):
    """F1 fe-inline. Inline backend: query directly."""
    return db.query(Ticket).all()


@app.get("/api/f2")
def f2_list_open(db: Session = Depends(get_db)):
    """F2 fe-localfn. Inline backend."""
    return db.query(Ticket).filter(Ticket.status == "open").all()


@app.get("/api/f3")
def f3_list_agents(db: Session = Depends(get_db)):
    """F3 fe-modulefn. Inline backend."""
    return db.query(Agent).all()


@app.get("/api/f4")
def f4_list_comments(db: Session = Depends(get_db)):
    """F4 fe-classmethod. Inline backend."""
    return db.query(Comment).all()


@app.post("/api/f5")
def f5_create_ticket(payload: CommentCreate, db: Session = Depends(get_db)):
    """F5 fe-hook. Inline backend: add + commit."""
    ticket = Ticket(subject=payload.author, body=payload.body, status="open")
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@app.get("/api/f6")
def f6_search(db: Session = Depends(get_db)):
    """F6 fe-wrapper-dynamic. Inline backend."""
    return db.query(Ticket).filter(Ticket.priority == "high").all()


# ── F7: backend local function (path fn -> same-file fn -> SQLAlchemy) ─

def _query_high_priority(db: Session):
    # same-file helper that runs the SQLAlchemy work
    return db.query(Ticket).filter(Ticket.priority == "high").all()


@app.get("/api/f7")
def f7_high_priority(db: Session = Depends(get_db)):
    """F7 be-localfn. Frontend is fe-modulefn."""
    return _query_high_priority(db)


# ── F8: backend module function (path fn -> repository fn -> SQLAlchemy)

@app.get("/api/f8")
def f8_ticket_comments(db: Session = Depends(get_db)):
    """F8 be-modulefn. Delegates to imported repository.list_comments_for_ticket."""
    return list_comments_for_ticket(db, 1)


@app.post("/api/f8")
def f8_add_comment(payload: CommentCreate, db: Session = Depends(get_db)):
    """F8 be-modulefn (write). Delegates to imported repository.add_comment."""
    return add_comment(db, 1, payload.author, payload.body)


# ── F9: backend class method (path fn -> service method -> SQLAlchemy) ─

@app.get("/api/f9")
def f9_agents(db: Session = Depends(get_db)):
    """F9 be-classmethod. Delegates to agent_service.list_agents."""
    return agent_service.list_agents(db)


# ── Realistic ticket CRUD (inline SQLAlchemy) ─────────────────────────

@app.get("/api/tickets/")
def list_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()


@app.post("/api/tickets/", status_code=201)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket = Ticket(
        subject=payload.subject,
        body=payload.body,
        priority=payload.priority,
        status="open",
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if payload.status is not None:
        ticket.status = payload.status
    if payload.priority is not None:
        ticket.priority = payload.priority
    if payload.assignee_id is not None:
        ticket.assignee_id = payload.assignee_id
    db.commit()
    db.refresh(ticket)
    return ticket


@app.delete("/api/tickets/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()


# ── Realistic agent CRUD (delegates to service class) ─────────────────

@app.get("/api/agents/")
def list_agents(db: Session = Depends(get_db)):
    return agent_service.list_agents(db)


@app.post("/api/agents/", status_code=201)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db)):
    return agent_service.create_agent(db, payload.name, payload.email)


@app.get("/api/agents/{agent_id}")
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    agent = agent_service.get_agent(db, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


# ── Realistic comment endpoints (delegates to repository module) ──────

@app.get("/api/comments/ticket/{ticket_id}")
def comments_for_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return list_comments_for_ticket(db, ticket_id)


@app.post("/api/comments/ticket/{ticket_id}", status_code=201)
def create_comment(ticket_id: int, payload: CommentCreate, db: Session = Depends(get_db)):
    return add_comment(db, ticket_id, payload.author, payload.body)


@app.get("/api/comments/stats/open-count")
def open_ticket_count(db: Session = Depends(get_db)):
    return {"open": count_open_tickets(db)}
