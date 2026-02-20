"use client";

import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";


interface EditClientModalProps {
    opened: boolean;
    onClose: () => void;
    client: Client;
    onSave: () => Promise<void>;
}

export default function EditClientModal({ opened, onClose, client, onSave }: EditClientModalProps) {
    const api = useApi();
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
    });

    useEffect(() => {
        if (client) {
            setForm({
                email: client.email,
                first_name: client.first_name,
                last_name: client.last_name,
            });
        }
        setError(null);
    }, [client, opened]);

    const handleSubmit = async () => {
        if (!client) return;

        try {
            setError(null);

            await api.clients.updateClient(client.id, form);

            await onSave(); // notify parent only after success
        } catch (err: any) {
            const message =
                err?.response?.data?.detail || "Something went wrong";
            setError(message);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Client">
            {error && (
            <div style={{ color: "red", marginBottom: 12 }}>
                {error}
            </div>
        )}
            
            <TextInput
                label="Email"
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.currentTarget.value })
                }
                mb="sm"
            />
            <TextInput
                label="First Name"
                value={form.first_name}
                onChange={(e) =>
                    setForm({ ...form, first_name: e.currentTarget.value })
                }
                mb="sm"
            />
            <TextInput
                label="Last Name"
                value={form.last_name}
                onChange={(e) =>
                    setForm({ ...form, last_name: e.currentTarget.value })
                }
                mb="md"
            />

            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>
                    Save
                </Button>
            </Group>
        </Modal>
    );
}