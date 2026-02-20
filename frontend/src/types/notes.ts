export type NoteType = "actionItem" | "reminder" | "summary";
export type NoteStatus = "open" | "closed";

export interface UserInfo {
    id: string;
    email: string;
}

export interface Note {
    id: string;
    type: NoteType;
    content: string;
    created_at: string;
    created_by: string;
    creator: UserInfo;
    updated_at: string;
    due_date: string;
    completed_at?: string;
    completed_by?: string;
    completer?: UserInfo;
    status: NoteStatus;
}


export interface CreateNotePayload {
    content: string;
    type: NoteType;
    due_date?: string;
    completed_at?: string;
    completed_by?:string;
    status?: NoteStatus;
}

export interface UpdateNotePayload {
    content?: string;
    type?: NoteType;
    status?: NoteStatus;
    completed_at?: string;
    completed_by?:string;
    due_date?: string;
}