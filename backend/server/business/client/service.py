from sqlalchemy import select
from sqlalchemy.orm import Session

from server.business.client.schema import PClient
from server.data.models.client import Client

def get_client(session: Session, client_id: str) -> PClient | None:
    client = session.get(Client, client_id)

    if client is None:
        return None
    
    return PClient.model_validate(client)


def list_clients(session: Session) -> list[PClient]:
    clients = session.execute(select(Client)).scalars().all()
    return [PClient.model_validate(client) for client in clients]
