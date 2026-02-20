from fastapi import APIRouter, HTTPException
from typing import Optional

from server.business.auth.auth_verifier import AuthVerifier
from server.business.auth.schema import UserTokenInfo
from server.business.user.service import list_users, create_user, update_user, delete_user
from server.business.user.schema import PUserRead

from server.shared.databasemanager import DatabaseManager
from server.shared.pydantic import PList


def get_router(database: DatabaseManager, auth_verifier: AuthVerifier) -> APIRouter:
    router = APIRouter()

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

    @router.post("/users", response_model=PUserRead)
    async def create_user_route(
        email: str,
        password_hashed: Optional[str] = None,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        with database.create_session() as session:
            try:
                new_user = create_user(
                    session, email=email, password_hashed=password_hashed
                )
                return new_user
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

    @router.put("/users/{user_id}", response_model=PUserRead)
    async def update_user_route(
        user_id: str,
        email: Optional[str] = None,
        password_hashed: Optional[str] = None,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        with database.create_session() as session:
            try:
                updated_user = update_user(
                    session,
                    user_id=user_id,
                    email=email,
                    password_hashed=password_hashed,
                )
                return updated_user
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))


    @router.delete("/users/{user_id}", status_code=204)
    async def delete_user_route(
        user_id: str,
        _: UserTokenInfo = auth_verifier.UserTokenInfo(),
    ):
        with database.create_session() as session:
            try:
                delete_user(session, user_id=user_id)
            except ValueError as e:
                raise HTTPException(status_code=404, detail=str(e))
            return None

    return router
