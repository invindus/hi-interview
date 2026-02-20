# Setup
- Make sure local postgres service isnt running
- Installing poetry, alembic: OK
- Need to run `poetry install` before running migrations so that it can find project root
- poetry install: OK
- install starter data: OK

  Email:    admin@hi.com
  Password: password
    - NOTE: changed Swagger auth to HTTPBearer instead of OAuth bc username (admin@hi.com) and password weren't working to authorize backend API testing

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
- delete note, add confirmation
- add pagination
- modal view show more details on note
- different views per note type (reminder checkbox, summary text field, )



# Task 3
Admins create new clients on front-end
Backend
- create client method
- fetch users in systems to see list of unassigned emails (users) so it can be assigned when created new client
- added update and delete methods
- confirmation to delete client

Frontend
- Modal for creating a client
- edit and delete options
- error handling when inputting email that already exists (and for editing client)


# Testing
- All tests passed, warnings for insecure key minimum length
- added 6 more tests to test_client


# UI
- create different ui for each note type
- add create note button top right of each note view
