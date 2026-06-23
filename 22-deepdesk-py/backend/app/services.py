"""Service classes — instance methods that talk to SQLAlchemy directly.

Used by F9 (be-classmethod): a path operation function calls a method on a
module-level service instance, which runs the SQLAlchemy work.
"""

from sqlalchemy.orm import Session

from .models import Agent


class AgentService:
    """Encapsulates agent persistence behind instance methods."""

    def list_agents(self, db: Session):
        # session.query(Agent).all() — read on `agents`
        return db.query(Agent).all()

    def create_agent(self, db: Session, name: str, email: str):
        # session.add + commit — write on `agents`
        agent = Agent(name=name, email=email)
        db.add(agent)
        db.commit()
        db.refresh(agent)
        return agent

    def get_agent(self, db: Session, agent_id: int):
        # session.query(...).get(...) — read on `agents`
        return db.query(Agent).get(agent_id)


# Module-level singleton instance the routers call methods on.
agent_service = AgentService()
