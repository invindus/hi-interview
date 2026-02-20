from fastapi import APIRouter, HTTPException
from typing import Optional

from server.business.auth.auth_verifier import AuthVerifier
from server.business.auth.schema import UserTokenInfo
from server.business.client.service import list_clients, get_client
from server.business.client.schema import PClient, PClientCreate
from server.business.user.service import list_users
from server.business.user.schema import PUserRead
from server.shared.databasemanager import DatabaseManager
from server.shared.pydantic import PList


def get_router(database: DatabaseManager, auth_verifier: AuthVerifier) -> APIRouter:
    router = APIRouter()

    @router.get("/client")
    async def list_clients_route(
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ) -> PList[PClient]:
        with database.create_session() as session:
            clients = list_clients(session)
            return PList(data=clients)

    @router.get("/client/{client_id}", response_model=PClient)
    async def get_client_route(
        client_id: str,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ) -> PClient:
        with database.create_session() as session:
            client = get_client(session, client_id)
            if client is None:
                raise HTTPException(status_code=404, detail="Client not found")
        return client

    @router.post("/client", response_model=PClient)
    async def create_client_route(
        client_data: PClientCreate,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        """Create a new client"""
        with database.create_session() as session:
            from server.business.client.service import create_client
            try:
                new_client = create_client(session, client_data)
                return new_client
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))


    # USER ENDPOINT  
    @router.get("/users")
    async def list_users_route(
        email: Optional[str] = None,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        """
        List all users that a client can be assigned to.
        Optional query param 'email' to search users by email.
        """
        with database.create_session() as session:
            users = list_users(session, email_search=email)
            return PList(data=users)

    return router
