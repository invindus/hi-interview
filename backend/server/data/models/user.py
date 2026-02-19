from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


from server.data.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "user"

    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    password_hashed: Mapped[str | None] = mapped_column(String, nullable=True)
