"use client";

import { Badge, Button, Divider, Group, Modal, Paper, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

import { useApi } from "@/api/context";
import { Note, NoteType, UpdateNotePayload } from "@/types/notes";

import DeleteNoteModal from "@/app/(authed)/components/DeleteNoteModal/DeleteNoteModal";

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
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    const [content, setContent] = useState("");
    const [type, setType] = useState<NoteType>("actionItem");
    const [status, setStatus] = useState<"open" | "closed">("open");
    const [dueDate, setDueDate] = useState<string | undefined>();
    const [completedAt, setCompletedAt] = useState<string | undefined>();
    const [completedBy, setCompletedBy] = useState<string | undefined>();

    // Set modal content depending on selected note
    useEffect(() => {
        if (!note) return;

        setContent(note.content);
        setType(note.type);
        setStatus(note.status);
        setDueDate(note.due_date || undefined);
        setCompletedAt(note.completed_at || undefined);
        setCompletedBy(note.completed_by || "");

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
                completed_at: completedAt || null,
                completed_by: completedBy || null,
                due_date: dueDate || undefined,
            } as UpdateNotePayload);

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
            setDeleteModalOpened(false);
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
        <>
        <Modal
            opened={opened}
            onClose={onClose}
            title="Note Details"
            size="lg"
            centered
        >
            <Stack gap="lg" className={styles.NoteModal}>

            {!editMode ? (
                <>
                <Group justify="space-between" align="center">
                    {/* Type and Status */}
                    <Group gap="sm" className={styles.BadgeGroup}>
                        <Badge color={getTypeColor()} variant="filled">{note.type}</Badge>
                        <Badge color={getStatusColor()}>{note.status.toUpperCase()}</Badge>
                    </Group>

                    {/* Actions */}
                    <Group gap="sm" className={styles.ButtonGroup}>
                    <Button variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
                    <Button color="red" variant="outline" onClick={() => setDeleteModalOpened(true)}>Delete</Button>
                    </Group>
                </Group>

                <Divider />

                {/* Content */}
                <Paper p="md" className={styles.NoteCard} withBorder shadow="xs">
                    <Text fw={600} mb={4}>Content</Text>
                    <Text style={{ whiteSpace: "pre-wrap" }}>{note.content}</Text>
                </Paper>

                <Divider />

                {/* Metadata */}
                <Paper p="md" className={styles.NoteCard} withBorder shadow="xs">
                    <Stack gap="xs">
                        <Text className={styles.MetadataText}><strong>Created At:</strong> {formatDate(note.created_at)}</Text>
                        <Text className={styles.MetadataText}><strong>Created By:</strong> {note.creator?.email || "—"}</Text>
                        <Text className={styles.MetadataText}><strong>Updated At:</strong> {formatDate(note.updated_at)}</Text>
                        <Divider/>
                        <Text className={styles.MetadataText}><strong>Due Date:</strong> {formatDate(note.due_date)}</Text>
                        <Divider/>
                        <Text className={styles.MetadataText}><strong>Completed At:</strong> {formatDate(note.completed_at)}</Text>
                        <Text className={styles.MetadataText}><strong>Completed By:</strong> {note.completed_by || "—"}</Text>
                    </Stack>
                </Paper>
                </>
            ): (            
                <>
                <Stack gap="sm">
                    <Textarea label="Content" value={content} onChange={(e) => setContent(e.currentTarget.value)} minRows={4} />
                    <Select
                        label="Type"
                        value={type}
                        data={[
                            { value: "actionItem", label: "Action Item" },
                            { value: "reminder", label: "Reminder" },
                            { value: "summary", label: "Summary" },
                        ]}
                        onChange={(v) => setType(v as NoteType)}
                    />
                    <Select
                        label="Status"
                        value={status}
                        data={[
                            { value: "open", label: "Open" },
                            { value: "closed", label: "Closed" },
                        ]}
                        onChange={(v) => setStatus(v as "open" | "closed")}
                    />
                    <TextInput
                        label="Due Date"
                        type="datetime-local"
                        value={dueDate || ""}
                        onChange={(e) => setDueDate(e.currentTarget.value)}
                    />
                    <TextInput
                        label="Completed At"
                        type="datetime-local"
                        value={completedAt || ""}
                        onChange={(e) => setCompletedAt(e.currentTarget.value)}
                    />

                    <TextInput
                        label="Completed By"
                        placeholder="Enter name or email"
                        value={completedBy || ""}
                        onChange={(e) => setCompletedBy(e.currentTarget.value)}
                    />

                    <Group justify="space-between" mt="md">
                        <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </Group>
                </Stack>
                </>
            )}
            </Stack>
        </Modal>
        <DeleteNoteModal
            opened={deleteModalOpened}
            onClose={() => setDeleteModalOpened(false)}
            onConfirm={handleDelete}
        />
        </>
    );
}
