# Setup
- Make sure local postgres service isnt running
- Installing poetry, alembic: OK
- Need to run `poetry install` before running migrations so that it can find project root
- poetry install: OK
- install starter data: OK

  Email:    admin@hi.com
  Password: password

- yarn install: OK

---

Going through all tasks to see if I can work on anything at the same time.

---

# Task 1
Admin click on client, go to detail page with full client info.

- Create basic CRUD API for clients. (Task 1 and 3 use CRUD)
    - now its just read all
    id: str
    email: str
    first_name: str
    last_name: str
    assigned_user_id: str | None
    created_at: datetime
    updated_at: datetime

- Adding details page to front end.
    - Creating getClient method to fetch single user's details
    - On click of row, route to details page

- In backend, creating CRUD
    - Renamed list.py to service.py
    - Client GET route

# Task 2
Notes feature on client details page
- Action items, summaries, reminders
- Another CRUD API for notes
Show created_by and created_at

Data Model
    id: str
    client_id (FK): str 
    type (actionItem, reminder, summary): enum
    content: text
    created_by: str
    created_at: datetime

    is_deleted: bool
    deleted_at: datetime
    due_date: datetime
    completed_at: datetime
    completed_by: str
    status (open, closed): enum

Backend
- Create notes model, schema
- Update client model with note relationship
- update migration
- load imports in database manager to properly locate Notes
- Create notes CRUD
- CRUD routing, include in route/app.py router

Frontend
- add notes component to details page
- add way to create note
- update note
- delete note
- add pagination
- modal view show more details on note
- different views per note type (reminder checkbox, summary text field, )



# Task 3
Admins create new clients on front-end
- Add live updates to clinet list when new client is added