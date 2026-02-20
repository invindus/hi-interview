export type NoteType = "actionItem" | "reminder" | "summary";

export interface Note {
    id: string;
    type: NoteType;
    content: string;
    created_at: string;
    updated_at: string;
    due_date: string;
    completed_at: string;
    completed_by: string;
    status: "open" | "closed";
}

export interface CreateNotePayload {
    content: string;
    type: NoteType;
}
