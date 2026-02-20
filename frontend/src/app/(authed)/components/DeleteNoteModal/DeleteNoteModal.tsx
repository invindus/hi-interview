"use client";

import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { useState, useEffect } from "react";

interface DeleteNoteModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteNoteModal({ opened, onClose, onConfirm }: DeleteNoteModalProps) {
    const [confirmChecked, setConfirmChecked] = useState(false);

    useEffect(() => {
        if (!opened) setConfirmChecked(false);
    }, [opened]);

    return (
        <Modal opened={opened} onClose={onClose} title="Confirm Deletion" centered>
            <Checkbox
                label="I understand this action cannot be undone"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.currentTarget.checked)}
                mb="md"
            />

            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="red" disabled={!confirmChecked} onClick={onConfirm}>
                    Confirm Delete
                </Button>
            </Group>
        </Modal>
    );
}