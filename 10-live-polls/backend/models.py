"""Tortoise ORM models and CRUD surface for polls & votes."""

from tortoise import fields
from tortoise.models import Model


class Poll(Model):
    id = fields.IntField(pk=True)
    question = fields.CharField(max_length=255)
    options = fields.JSONField()
    votes = fields.JSONField()
    created_by = fields.IntField()


class Vote(Model):
    id = fields.IntField(pk=True)
    poll_id = fields.IntField()
    option_index = fields.IntField()


async def list_polls():
    return await Poll.all()


async def get_poll(poll_id: int):
    return await Poll.get(id=poll_id)


async def get_poll_or_none(poll_id: int):
    return await Poll.get_or_none(id=poll_id)


async def create_poll(question: str, options: list, created_by: int):
    return await Poll.create(
        question=question,
        options=options,
        votes=[0 for _ in options],
        created_by=created_by,
    )


async def record_vote(poll_id: int, option_index: int):
    await Vote.create(poll_id=poll_id, option_index=option_index)
    poll = await Poll.get(id=poll_id)
    poll.votes[option_index] += 1
    await Poll.filter(id=poll_id).update(votes=poll.votes)
    return poll


async def count_votes(poll_id: int):
    return await Vote.filter(poll_id=poll_id).all().count()
