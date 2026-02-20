from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from server.business.client.schema import PClient, PClientCreate, PClientUpdate
from server.data.models.client import Client
from server.data.models.user import User


def list_clients(session: Session) -> list[PClient]:
    clients = session.execute(select(Client)).scalars().all()
    return [PClient.model_validate(client) for client in clients]


def get_client(session: Session, client_id: str) -> PClient | None:
    client = session.get(Client, client_id)

    if client is None:
        return None
    
    return PClient.model_validate(client)


def create_client(session: Session, client_data: PClientCreate) -> PClient:
    """
    Creates a new client. 
    Optionally assigns to a user if assigned_user_id is provided.
    Raises ValueError if email already exists or assigned user doesn't exist.
    """

    # Check for duplicate email
    existing = session.execute(
        select(Client).where(Client.email == client_data.email)
    ).scalar_one_or_none()
    if existing:
        raise ValueError("Client email already exists")

    # Validate assigned user if provided
    if client_data.assigned_user_id:
        user = session.get(User, client_data.assigned_user_id)
        if not user:
            raise ValueError("Assigned user does not exist")

    new_client = Client(
        email=client_data.email,
        first_name=client_data.first_name,
        last_name=client_data.last_name,
        assigned_user_id=client_data.assigned_user_id,
    )
    session.add(new_client)
    try:
        session.commit()
        session.refresh(new_client)
    except IntegrityError as e: # Incase adding a client with an email that already exists
        session.rollback()
        raise ValueError(f"Database error: {str(e)}")

    return PClient.model_validate(new_client)


def update_client(
    session: Session, client_id: str, client_data: PClientUpdate
) -> PClient:
    """
    Update an existing client.
    Raises ValueError if client does not exist, email duplicates, or assigned user doesn't exist.
    """
    client = session.get(Client, client_id)
    if not client:
        raise ValueError(f"Client with id '{client_id}' not found")

    # Check if email is changing and duplicates another client
    if client.email != client_data.email:
        existing = session.execute(
            select(Client).where(Client.email == client_data.email)
        ).scalar_one_or_none()
        if existing:
            raise ValueError("Client email already exists")

    # Validate assigned user if provided
    if client_data.assigned_user_id:
        user = session.get(User, client_data.assigned_user_id)
        if not user:
            raise ValueError("Assigned user does not exist")

    # Update fields
    client.email = client_data.email
    client.first_name = client_data.first_name
    client.last_name = client_data.last_name
    client.assigned_user_id = client_data.assigned_user_id

    try:
        session.commit()
        session.refresh(client)
    except IntegrityError as e:
        session.rollback()
        raise ValueError(f"Database error: {str(e)}")

    return PClient.model_validate(client)


def delete_client(session: Session, client_id: str) -> None:
    """
    Delete a client by ID.
    Raises ValueError if client does not exist.
    """
    client = session.get(Client, client_id)
    if not client:
        raise ValueError(f"Client with id '{client_id}' not found")

    session.delete(client)
    session.commit()
