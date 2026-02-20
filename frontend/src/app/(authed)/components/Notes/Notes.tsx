"use client";

import { Table, Title, Textarea, Button, Select, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useApi } from "@/api/context";
import { Note, NoteType } from "@/types/notes";

import NoteModal from "../NoteModal/NoteModal";
import styles from "./Notes.module.scss";

export default function Notes() {
    const { clientId } = useParams();
    const api = useApi();
    const [notes, setNotes] = useState<Note[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
  
    // Note Creation
    const [newNoteContent, setNewNoteContent] = useState("");
    const [newNoteType, setNewNoteType] = useState<NoteType>("actionItem");
    
    // Note Modal
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!clientId) return;
        const id = Array.isArray(clientId) ? clientId[0] : clientId;

        api.notes.listNotes(id)
        .then(setNotes)
        .finally(() => setNotesLoading(false));
    }, [api, clientId]);

    const handleCreateNote = async () => {
        if (!newNoteContent.trim() || !clientId) return;

        const id = Array.isArray(clientId) ? clientId[0] : clientId;

        try {
        const created = await api.notes.createNote(id, {
            content: newNoteContent,
            type: newNoteType,
        });
        setNotes(prev => [...prev, created]);
        setNewNoteContent("");
        setNewNoteType("actionItem");
        } catch (err) {
        console.error("Failed to create note", err);
        }
    };

    return (
        <div style={{ marginTop: "2rem" }}>
        <Title order={3}>Notes</Title>

        {notesLoading ? (
            <div>Loading notes...</div>
        ) : (
            <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                <Table.Th>Content</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Updated</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {notes.map(note => (
                <Table.Tr 
                    key={note.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                    setSelectedNote(note);
                    setModalOpen(true);
                    }}
                >
                    <Table.Td>{note.content}</Table.Td>
                    <Table.Td>{note.type}</Table.Td>
                    <Table.Td>{note.status}</Table.Td>
                    <Table.Td>{new Date(note.created_at).toLocaleString()}</Table.Td>
                    <Table.Td>{new Date(note.updated_at).toLocaleString()}</Table.Td>
                </Table.Tr>
                ))}
                {notes.length === 0 && (
                <Table.Tr>
                    <Table.Td colSpan={5}>No notes yet</Table.Td>
                </Table.Tr>
                )}
            </Table.Tbody>
            </Table>
        )}

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Select
            label="Note Type"
            data={[
                { value: "actionItem", label: "Action Item" },
                { value: "reminder", label: "Reminder" },
                { value: "summary", label: "Summary" },
            ]}
            value={newNoteType}
            onChange={value => setNewNoteType(value as NoteType)}
            />
            <Textarea
            placeholder="Enter note content"
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.currentTarget.value)}
            />
            <Button onClick={handleCreateNote}>Add Note</Button>
        </div>

        <NoteModal
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            note={selectedNote}
            onUpdated={(updated) => {
                setNotes(prev =>
                prev.map(n => (n.id === updated.id ? updated : n))
                );
                setSelectedNote(updated);
            }}
            onDeleted={(id) => {
                setNotes(prev => prev.filter(n => n.id !== id));
                setSelectedNote(null);
            }}
        />
        </div>
    );
}
