import { AxiosInstance } from "axios";

import { Note, CreateNotePayload } from "@/types/notes";

export default class NotesApi {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    // List all notes for a specific client
    public listNotes = async (clientId: string): Promise<Note[]> => {
        const response = await this.axiosInstance.get<{ data: Note[] }>(`/client/${clientId}/notes`);
        return response.data.data;
    };

    // Create a new note for a client
    public createNote = async (clientId: string, payload: CreateNotePayload): Promise<Note> => {
        const response = await this.axiosInstance.post<Note>(`/client/${clientId}/notes`, payload);
        return response.data;
    };

    // Update a note by ID
      public updateNote = async (noteId: string, payload: Partial<CreateNotePayload & { status: "open" | "closed" }>): Promise<Note> => {
        const response = await this.axiosInstance.put<Note>(`/notes/${noteId}`, payload);
        return response.data;
    };

    // Delete a note by ID
    public deleteNote = async (noteId: string): Promise<void> => {
        await this.axiosInstance.delete(`/notes/${noteId}`);
    };
}
