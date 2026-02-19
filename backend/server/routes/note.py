from fastapi import APIRouter, HTTPException

from server.business.auth.auth_verifier import AuthVerifier
from server.business.auth.schema import UserTokenInfo
from server.business.note.service import (
    list_notes, 
    get_note, 
    create_note, 
    update_note, 
    delete_note
)
from server.business.note.schema import PNoteRead, PNoteCreate, PNoteUpdate
from server.shared.databasemanager import DatabaseManager
from server.shared.pydantic import PList


def get_router(database: DatabaseManager, auth_verifier: AuthVerifier) -> APIRouter:
    router = APIRouter()

    # List notes for a client
    @router.get("/client/{client_id}/notes")
    async def list_notes_route(
        client_id: str,
        user: UserTokenInfo = auth_verifier.UserTokenInfo()
    ) -> PList[PNoteRead]:
        with database.create_session() as session:
            notes = list_notes(session, client_id)
            return PList(data=notes)


    # Get a single note
    @router.get("/notes/{note_id}", response_model=PNoteRead)
    async def get_note_route(
        note_id: str,
        _: UserTokenInfo = auth_verifier.UserTokenInfo()
    ) -> PNoteRead:
        with database.create_session() as session:
            try:
                note = get_note(session, note_id)
            except ValueError:
                raise HTTPException(status_code=404, detail="Note not found")
        return note


    # Create a new note
    @router.post("/client/{client_id}/notes", response_model=PNoteRead)
    async def create_note_route(
        client_id: str,
        note: PNoteCreate,
        user: UserTokenInfo = auth_verifier.UserTokenInfo()
    ) -> PNoteRead:
        with database.create_session() as session:
            return create_note(session, note, client_id, created_by=user.user_id)


    # Update a note
    @router.put("/notes/{note_id}", response_model=PNoteRead)
    async def update_note_route(
        note_id: str,
        note: PNoteUpdate,
        _: UserTokenInfo = auth_verifier.UserTokenInfo()
    ) -> PNoteRead:
        with database.create_session() as session:
            try:
                return update_note(session, note_id, note)
            except ValueError:
                raise HTTPException(status_code=404, detail="Note not found")


    # Delete a note
    @router.delete("/notes/{note_id}")
    async def delete_note_route(
        note_id: str,
        _: UserTokenInfo = auth_verifier.UserTokenInfo()
    ):
        with database.create_session() as session:
            try:
                delete_note(session, note_id)
            except ValueError:
                raise HTTPException(status_code=404, detail="Note not found")
        return {"detail": "Note deleted successfully"}


    return router