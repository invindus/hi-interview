"use client";

import { Table, Title, Textarea, Button, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useApi } from "@/api/context";
import { Note, NoteType } from "@/types/notes";

import styles from "./Notes.module.scss";

export default function Notes() {
  const { clientId } = useParams();
  const api = useApi();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState<NoteType>("actionItem");

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
    console.log({ id: id, content: newNoteContent, type: newNoteType });

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
          <Table.Tbody>
            {notes.map(note => (
              <Table.Tr key={note.id}>
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
        <Textarea
          placeholder="Enter note content"
          value={newNoteContent}
          onChange={e => setNewNoteContent(e.currentTarget.value)}
        />
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
        <Button onClick={handleCreateNote}>Add Note</Button>
      </div>
    </div>
  );
}
