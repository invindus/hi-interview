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
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    status: Optional[NoteStatus] = NoteStatus.open


class PNoteUpdate(BaseModel):
    content: Optional[str] = None
    type: Optional[NoteType] = None
    status: Optional[NoteStatus] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None


class UserInfo(BaseModel):
    id: str
    email: str


class PNoteRead(BaseModel):
    id: str
    type: str
    content: str
    created_at: datetime
    created_by: str
    updated_at: datetime
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    completed_by: Optional[str]
    status: str
    creator: UserInfo
