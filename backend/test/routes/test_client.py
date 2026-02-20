from fastapi.testclient import TestClient

from server.data.models.client import Client
from server.shared.databasemanager import DatabaseManager
from server.business.client.service import (
    list_clients,
    get_client,
    create_client,
    update_client,
    delete_client,
)
from server.business.client.schema import PClientCreate, PClientUpdate
from server.data.models.user import User


def test_list_clients(test_client: TestClient, database: DatabaseManager) -> None:
    with database.create_session() as session:
        session.add(Client(email="alice@example.com", first_name="Alice", last_name="Smith"))
        session.add(Client(email="bob@example.com", first_name="Bob", last_name="Jones"))
        session.commit()

    response = test_client.get("/client")
    assert response.status_code == 200

    data = response.json()
    assert len(data["data"]) >= 2

    emails = [c["email"] for c in data["data"]]
    assert "alice@example.com" in emails
    assert "bob@example.com" in emails


def test_list_clients_unauthenticated(unauthenticated_test_client: TestClient) -> None:
    response = unauthenticated_test_client.get("/client")
    assert response.status_code == 401


def test_list_clients_with_assigned_user(
    test_client: TestClient, database: DatabaseManager, user_id: str
) -> None:
    with database.create_session() as session:
        session.add(
            Client(
                email="assigned@example.com",
                first_name="Charlie",
                last_name="Brown",
                assigned_user_id=user_id,
            )
        )
        session.commit()

    response = test_client.get("/client")
    assert response.status_code == 200

    data = response.json()
    assigned = [c for c in data["data"] if c["email"] == "assigned@example.com"]
    assert len(assigned) == 1
    assert assigned[0]["assigned_user_id"] == user_id


def test_create_client_duplicate_email(database: DatabaseManager) -> None:
    with database.create_session() as session:
        client_data = PClientCreate(
            email="bob@example.com", first_name="Bob", last_name="Jones"
        )

        try:
            # Attempt to create duplicate
            create_client(session, client_data)
            assert False, "Expected ValueError for duplicate email"
        except ValueError as e:
            assert "Client email already exists" in str(e)


def test_get_client_not_found(database: DatabaseManager) -> None:
    with database.create_session() as session:
        fetched = get_client(session, "nonexistent")
        assert fetched is None


def test_update_client(database: DatabaseManager, user_id: str) -> None:
    with database.create_session() as session:
        client = create_client(
            session,
            PClientCreate(email="dan@example.com", first_name="Dan", last_name="Brown"),
        )

        updated_data = PClientUpdate(
            email="daniel@example.com",
            first_name="Daniel",
            last_name="Brown",
            assigned_user_id=user_id,
        )
        updated_client = update_client(session, client.id, updated_data)

        assert updated_client.email == "daniel@example.com"
        assert updated_client.assigned_user_id == user_id


def test_update_client_duplicate_email(database: DatabaseManager) -> None:
    with database.create_session() as session:
        c1 = create_client(
            session,
            PClientCreate(email="e1@example.com", first_name="E1", last_name="Test"),
        )
        c2 = create_client(
            session,
            PClientCreate(email="e2@example.com", first_name="E2", last_name="Test"),
        )

        updated_data = PClientUpdate(
            email="e1@example.com", first_name="E2", last_name="Test"
        )

        try:
            update_client(session, c2.id, updated_data)
            assert False, "Expected ValueError for duplicate email"
        except ValueError as e:
            assert "Client email already exists" in str(e)


def test_delete_client(database: DatabaseManager) -> None:
    with database.create_session() as session:
        client = create_client(
            session,
            PClientCreate(
                email="frank@example.com", first_name="Frank", last_name="Smith"
            ),
        )
        delete_client(session, client.id)

        assert get_client(session, client.id) is None


def test_delete_client_not_found(database: DatabaseManager) -> None:
    with database.create_session() as session:
        try:
            delete_client(session, "nonexistent")
            assert False, "Expected ValueError for non-existent client"
        except ValueError as e:
            assert "Client with id 'nonexistent' not found" in str(e)
