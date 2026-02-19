from sqlalchemy import select
from sqlalchemy.orm import Session

from server.business.note.schema import PNoteCreate, PNoteRead, PNoteUpdate
from server.data.models.note import Note


def list_notes(session: Session, client_id: str) -> list[PNoteRead]:
    """List all notes for a given client"""
    notes = session.execute(
        select(Note).where(Note.client_id == client_id)
    ).scalars().all()
    return [PNoteRead.model_validate(n) for n in notes]


def get_note(session: Session, note_id: str) -> PNoteRead:
    """Get a single note by its ID"""
    note = session.get(Note, note_id)
    if not note:
        raise ValueError(f"Note with id {note_id} not found")
    return PNoteRead.model_validate(note)


def create_note(session: Session, note: PNoteCreate, client_id: str, created_by: str) -> PNoteRead:
    """Create a new note for a client"""
    new_note = Note(**note.model_dump(), client_id=client_id, created_by=created_by)
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    return PNoteRead.model_validate(new_note)


def update_note(session: Session, note_id: str, note: PNoteUpdate) -> PNoteRead:
    """Update an existing note by ID"""
    existing_note = session.get(Note, note_id)
    if not existing_note:
        raise ValueError(f"Note with id {note_id} not found")

    # Update fields
    for field, value in note.model_dump().items():
        setattr(existing_note, field, value)

    session.commit()
    session.refresh(existing_note)
    return PNoteRead.model_validate(existing_note)


def delete_note(session: Session, note_id: str) -> None:
    """Delete a note by ID"""
    existing_note = session.get(Note, note_id)
    if not existing_note:
        raise ValueError(f"Note with id {note_id} not found")

    session.delete(existing_note)
    session.commit()
