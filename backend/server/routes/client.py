from fastapi import APIRouter, HTTPException
from typing import Optional

from server.business.auth.auth_verifier import AuthVerifier
from server.business.auth.schema import UserTokenInfo
from server.business.client.service import list_clients, get_client, create_client, update_client, delete_client
from server.business.client.schema import PClient, PClientCreate, PClientUpdate

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
    

    @router.put("/client/{client_id}", response_model=PClient)
    async def update_client_route(
        client_id: str,
        client_data: PClientUpdate,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ) -> PClient:
        with database.create_session() as session:
            try:
                updated = update_client(session, client_id, client_data)
                if updated is None:
                    raise HTTPException(status_code=404, detail="Client not found")
                return updated
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
            
            
    @router.delete("/client/{client_id}")
    async def delete_client_route(
        client_id: str,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        with database.create_session() as session:
            try:
                delete_client(session, client_id)
            except ValueError as e:
                raise HTTPException(status_code=404, detail=str(e))

        return {"message": "Client deleted successfully"}

    return router
