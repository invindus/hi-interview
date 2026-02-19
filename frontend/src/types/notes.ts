export type NoteType = "actionItem" | "reminder" | "summary";

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  content: string;
  type: NoteType;
}
