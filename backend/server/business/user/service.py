from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Optional

from server.data.models.user import User
from server.business.user.schema import PUserRead


def list_users(session: Session, email_search: Optional[str] = None) -> list[PUserRead]:
    """
    List users for client assignment.
    Optional `email_search` filters users whose emails contain the search string.
    """
    query = select(User)
    if email_search:
        query = query.where(User.email.ilike(f"%{email_search}%"))

    users = session.execute(query).scalars().all()
    return [PUserRead(id=u.id, email=u.email) for u in users]
