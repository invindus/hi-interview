from typing import Optional
from datetime import datetime
import enum

from server.shared.pydantic import BaseModel


# -----------------------
# Enums
# -----------------------
class NoteType(str, enum.Enum):
    action_item = "actionItem"
    reminder = "reminder"
    summary = "summary"


class NoteStatus(str, enum.Enum):
    open = "open"
    closed = "closed"


# -----------------------
# Schemas
# -----------------------
class PNoteCreate(BaseModel):
    content: str
    type: NoteType
    due_date: Optional[datetime] = None
    status: Optional[NoteStatus] = NoteStatus.open


class PNoteUpdate(BaseModel):
    content: Optional[str] = None
    type: Optional[NoteType] = None
    status: Optional[NoteStatus] = None
    completed_at: Optional[datetime] = None


class PNoteRead(BaseModel):
    id: str
    client_id: str
    content: str
    type: NoteType
    created_by: str
    status: NoteStatus
    created_at: datetime
    updated_at: datetime

