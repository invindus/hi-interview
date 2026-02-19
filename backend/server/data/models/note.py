from typing import TYPE_CHECKING
from datetime import datetime
import enum

from sqlalchemy import DateTime, ForeignKey, String, Text, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from server.data.models.base import BaseModel

if TYPE_CHECKING:
    from server.data.models.client import Client
    from server.data.models.user import User


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
# Model
# -----------------------

class Note(BaseModel):
    __tablename__ = "note"

    client_id: Mapped[str] = mapped_column(
        String, ForeignKey("client.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[NoteType] = mapped_column(Enum(NoteType), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_by: Mapped[str] = mapped_column(String, ForeignKey("user.id"), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_by: Mapped[str | None] = mapped_column(String, ForeignKey("user.id"), nullable=True)
    status: Mapped[NoteStatus] = mapped_column(
        Enum(NoteStatus), nullable=False, default=NoteStatus.open
    )
    
    
    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="notes")
    creator: Mapped["User"] = relationship("User", foreign_keys=[created_by])
    completer: Mapped["User | None"] = relationship("User", foreign_keys=[completed_by])
