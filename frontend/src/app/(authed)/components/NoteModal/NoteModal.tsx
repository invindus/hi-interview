"use client";

import { Badge, Button, Divider, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

import { useApi } from "@/api/context";
import { Note, NoteType } from "@/types/notes";

import styles from "./NoteModal.module.scss";

interface NoteModalProps {
    opened: boolean;
    onClose: () => void;
    note: Note | null;
    onUpdated: (updated: Note) => void;
    onDeleted: (id: string) => void;
}

export default function NoteModal({
    opened, onClose, note, onUpdated, onDeleted
}: NoteModalProps) {
    const api = useApi();
    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState("");
    const [type, setType] = useState<NoteType>("actionItem");
    const [status, setStatus] = useState<"open" | "closed">("open");

    // Set modal content depending on selected note
    useEffect(() => {
        if (!note) return;

        setContent(note.content);
        setType(note.type);
        setStatus(note.status);
        setEditMode(false);
    }, [note]);

    if (!note) return null;

    // -----
    // Handle Functions
    // -----
    const handleSave = async () => {
        try {
            const updated = await api.notes.updateNote(note.id, {
                content,
                type,
                status,
            });

            onUpdated(updated);
            setEditMode(false);
        } catch (err) {
            console.error("Failed to update note", err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.notes.deleteNote(note.id);
            onDeleted(note.id);
            onClose();
        } catch (err) {
            console.error("Failed to delete note", err);
        }
    };

    // -----
    // Helper Functions
    // -----

    // If theres no date for due date or completed_at, show '—'
    const formatDate = (value?: string) =>
        value ? new Date(value).toLocaleString() : "—";

    const getTypeColor = () => {
        switch (note.type) {
        case "actionItem":
            return "blue";
        case "reminder":
            return "yellow";
        case "summary":
            return "gray";
        default:
            return "gray";
        }
    };

    const getStatusColor = () => {
        return note.status === "open" ? "green" : "red";
    };

    return (
    <Modal
        opened={opened}
        onClose={onClose}
        title="Note Details"
        size="lg"
        centered
    >
        <Stack gap="md">

        {!editMode ? (
            <>
            <Group>
                <Badge color={getTypeColor()}>{note.type}</Badge>
                <Badge color={getStatusColor()}>{note.status}</Badge>
            </Group>

            <Divider />

            <div>
                <Text fw={600}>Content</Text>
                <Text mt="xs">{note.content}</Text>
            </div>

            <Divider />

            <Text size="sm">
              <strong>Created:</strong> {formatDate(note.created_at)}
            </Text>
            <Text size="sm">
              <strong>Updated:</strong> {formatDate(note.updated_at)}
            </Text>
            <Text size="sm">
              <strong>Due:</strong> {formatDate(note.due_date)}
            </Text>
            <Text size="sm">
              <strong>Completed:</strong> {formatDate(note.completed_at)}
            </Text>
            <Text size="sm">
              <strong>Completed By:</strong> {note.completed_by || "—"}
            </Text>

            <Group justify="space-between" mt="md">
              <Button variant="light" onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Button color="red" variant="light" onClick={handleDelete}>
                Delete
              </Button>
            </Group>
            
            </>
        ): (            
            <>
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />

            <Select
              label="Type"
              value={type}
              data={[
                { value: "actionItem", label: "Action Item" },
                { value: "reminder", label: "Reminder" },
                { value: "summary", label: "Summary" },
              ]}
              onChange={(value) => setType(value as NoteType)}
            />

            <Select
              label="Status"
              value={status}
              data={[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
              ]}
              onChange={(value) => setStatus(value as "open" | "closed")}
            />

            <Group justify="space-between" mt="md">
              <Button variant="light" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </Group>
          </>
        )}

            

        </Stack>
    </Modal>
    );
}
