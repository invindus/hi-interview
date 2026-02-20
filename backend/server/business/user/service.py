from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
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


def create_user(
    session: Session, email: str, password_hashed: Optional[str] = None
) -> PUserRead:
    """
    Create a new user with optional hashed password.
    Raises ValueError if email already exists.
    """
    new_user = User(email=email, password_hashed=password_hashed)
    session.add(new_user)
    try:
        session.commit()
        session.refresh(new_user)
    except IntegrityError:
        session.rollback()
        raise ValueError(f"User with email '{email}' already exists")

    return PUserRead(id=new_user.id, email=new_user.email)


def update_user(
    session: Session, user_id: str, email: Optional[str] = None, password_hashed: Optional[str] = None,
) -> PUserRead:
    """
    Update a user's email and/or password.
    Raises ValueError if user not found or email already exists.
    """
    user = session.get(User, user_id)
    if not user:
        raise ValueError(f"User with id '{user_id}' not found")

    if email:
        user.email = email
    if password_hashed:
        user.password_hashed = password_hashed

    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        raise ValueError(f"Email '{email}' is already in use")

    return PUserRead(id=user.id, email=user.email)


def delete_user(session: Session, user_id: str) -> None:
    """
    Delete a user by ID.
    Raises ValueError if user not found.
    """
    user = session.get(User, user_id)
    if not user:
        raise ValueError(f"User with id '{user_id}' not found")

    session.delete(user)
    session.commit()
