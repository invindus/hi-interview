"use client";

import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
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
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        assigned_user_id: null as string | null,
    });

    // Load users for dropdown
    useEffect(() => {
        api.users.listUsers().then((users) => {
            setUserOptions(users.map(u => ({ value: u.id, label: u.email })));
        });
    }, [api]);

    useEffect(() => {
        if (client) {
            setForm({
                email: client.email,
                first_name: client.first_name,
                last_name: client.last_name,
                assigned_user_id: client.assigned_user_id || null,
            });
        }
        setError(null);
    }, [client, opened]);

    const handleSubmit = async () => {
        if (!client) return;

        try {
            setError(null);

            const payload = {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                ...(form.assigned_user_id ? { assigned_user_id: form.assigned_user_id } : {}),
            };

            await api.clients.updateClient(client.id, payload);

            await onSave();
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
            <Select
                label="Assign User"
                placeholder="Optional"
                data={userOptions}
                value={form.assigned_user_id || ""}
                onChange={(v) =>
                    setForm({ ...form, assigned_user_id: v || null })
                }
                searchable
                clearable
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