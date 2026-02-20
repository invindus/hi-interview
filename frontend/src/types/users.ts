export interface User {
  id: string;
  email: string;
}

export interface ListUsersParams {
  email?: string; // for searching for a user's email to link with a client
}