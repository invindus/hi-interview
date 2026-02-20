from datetime import datetime
from typing import Optional

from server.shared.pydantic import BaseModel
from server.data.models.client import Client


class PClient(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    assigned_user_id: str | None
    created_at: datetime
    updated_at: datetime | None


class PClientCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    assigned_user_id: Optional[str] = None


class PClientUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    assigned_user_id: Optional[str] = None
