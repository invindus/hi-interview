"use client";

import { Button, Divider, Group, Modal, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

import { useApi } from "@/api/context";
import { Note, NoteType } from "@/types/notes";

interface CreateNoteModalProps {
    opened: boolean;
    onClose: () => void;
    noteType: NoteType;
    onCreated: (note: Note) => void;
    clientId: string | string[] | undefined;
}


export default function CreateNoteModal({ opened, onClose, noteType, onCreated, clientId }: CreateNoteModalProps) {
  const api = useApi();

  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>(noteType);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [completedAt, setCompletedAt] = useState<string | undefined>();
  const [completedBy, setCompletedBy] = useState<string | undefined>();

  const [saving, setSaving] = useState(false);

  // change note type when prop changes
  useEffect(() => {
    setType(noteType);
  }, [noteType]);

  const handleSave = async () => {
    if (!content.trim()) return;

    const id = Array.isArray(clientId) ? clientId[0] : clientId;
    if (!id) return;

    try {
      setSaving(true);
      const created = await api.notes.createNote(id, { 
            content,
            type,
            due_date: dueDate || undefined,
            completed_at: completedAt || undefined,
            completed_by: completedBy || undefined,
        });

      onCreated(created);
      setContent("");
      setDueDate(undefined);
      setCompletedAt(undefined);
      setCompletedBy(undefined);

      onClose();
    } catch (err) {
      console.error("Failed to create note", err);
    } finally {
      setSaving(false);
    }
  };

    return (
    <Modal
        opened={opened}
        onClose={onClose}
        title="Create Note"
        size="md"
        centered
    >
        <Stack gap="sm">
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
            <Textarea
                label="Content"
                value={content}
                onChange={(e) => setContent(e.currentTarget.value)}
                minRows={4}
            />
            <TextInput
                label="Due Date"
                type="datetime-local"
                value={dueDate || ""}
                onChange={(e) => setDueDate(e.currentTarget.value)}
            />
            <Divider />
            <TextInput
                label="Completed At"
                type="datetime-local"
                value={completedAt || ""}
                onChange={(e) => setCompletedAt(e.currentTarget.value)}
            />
            <TextInput
                label="Completed By"
                placeholder="Name or email"
                value={completedBy || ""}
                onChange={(e) => setCompletedBy(e.currentTarget.value)}
            />
            <Group justify="right" mt="md">
                <Button variant="outline" onClick={onClose}>
                Cancel
                </Button>
                <Button onClick={handleSave} loading={saving}>
                Create
                </Button>
            </Group>
        </Stack>
    </Modal>
    );
}