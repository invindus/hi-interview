"use client";

import { Table, Title, Textarea, Button, Select, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useApi } from "@/api/context";
import { Note, NoteType } from "@/types/notes";

import NoteModal from "@/app/(authed)/components/NoteModal/NoteModal"
import CreateNoteModal from "@/app/(authed)/components/CreateNoteModal/CreateNoteModal";
import ActionItemView from "@/app/(authed)/components/Notes/ActionItemView/ActionItemView";
import ReminderView from "@/app/(authed)/components/Notes/ReminderView/ReminderView";
import SummaryView from "@/app/(authed)/components/Notes/SummaryView/SummaryView";

import styles from "./Notes.module.scss";


export default function Notes() {
    const { clientId } = useParams();
    const api = useApi();
    const [notes, setNotes] = useState<Note[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
  
    // Note Creation
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createType, setCreateType] = useState<NoteType>("actionItem");
    const [createContent, setCreateContent] = useState("");
    
    // Note Modal
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!clientId) return;
        const id = Array.isArray(clientId) ? clientId[0] : clientId;

        api.notes.listNotes(id)
        .then(setNotes)
        .finally(() => {setNotesLoading(false);});
    }, [api, clientId]);

    const openCreateModal = (type: NoteType) => {
        setCreateType(type);
        setCreateContent("");
        setSelectedNote(null);
        setCreateModalOpen(true);
    };

    const handleCreateNote = async () => {
        if (!createContent.trim() || !clientId) return;
        const id = Array.isArray(clientId) ? clientId[0] : clientId;

        try {
            const created = await api.notes.createNote(id, {
                content: createContent,
                type: createType,
            });
            setNotes(prev => [...prev, created]);
            setModalOpen(false);
        } catch (err) {
            console.error("Failed to create note", err);
        }
    };

    // Splitting Notes by Type
    const actionItems = notes.filter(n => n.type === "actionItem");
    const reminders = notes.filter(n => n.type === "reminder");
    const summaries = notes.filter(n => n.type === "summary");

    return (
        <div style={{ marginTop: "2rem" }}>
            <Title order={3} className={styles.title}>Notes</Title>

            {notesLoading ? (
            <div>Loading notes...</div>
            ) : (
            <div className={styles.columns}>
                <ActionItemView
                    notes={actionItems}
                    onSelect={(note) => {
                        setSelectedNote(note);
                        setModalOpen(true);
                    }}
                    onCreate={() => openCreateModal("actionItem")}
                />

                <ReminderView
                    notes={reminders}
                    onSelect={(note) => {
                        setSelectedNote(note);
                        setModalOpen(true);
                    }}
                    onCreate={() => openCreateModal("reminder")}
                />

                <SummaryView
                    notes={summaries}
                    onSelect={(note) => {
                        setSelectedNote(note);
                        setModalOpen(true);
                    }}
                    onCreate={() => openCreateModal("summary")}
                />
            </div>
            )}


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

            <CreateNoteModal
                opened={createModalOpen}
                noteType={createType}
                clientId={clientId}
                onClose={() => setCreateModalOpen(false)}
                onCreated={(note) => setNotes((prev) => [...prev, note])}
            />
        </div>
    );
}
