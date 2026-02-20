"use client";

import { Button, Modal, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";
import { User } from "@/types/users";


interface CreateClientModalProps {
    opened: boolean;
    onClose: () => void;
    onClientCreated: (newClient: Client) => void; // replace `any` with your Client type
}

export default function CreateClientModal({ opened, onClose, onClientCreated }: CreateClientModalProps) {
    const api = useApi();
    const [users, setUsers] = useState<User[]>([]);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);

    const form = useForm({
        initialValues: {
        first_name: "",
        last_name: "",
        email: "",
        assigned_user_id: null as string | null,
        },
        validate: {
        first_name: (v) => (v ? null : "Required"),
        last_name: (v) => (v ? null : "Required"),
        email: (v) => (v ? null : "Required"),
        },
    });


    useEffect(() => {
        // Fetch users for dropdown
        api.users.listUsers()
        .then((users) => {
            setUserOptions(users.map(u => ({ value: u.id, label: u.email })));
        });
    }, [api]);

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                ...(values.assigned_user_id ? { assigned_user_id: values.assigned_user_id } : {}),
            };
            const newClient = await api.clients.createClient(payload);
            onClientCreated(newClient);
            onClose();
            form.reset();
        } catch (err) {
            console.error(err);
        }
    };


    return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Client"
      centered
    >
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                label="First Name"
                placeholder="First Name"
                {...form.getInputProps("first_name")}
                required
                mb="sm"
            />
            <TextInput
                label="Last Name"
                placeholder="Last Name"
                {...form.getInputProps("last_name")}
                required
                mb="sm"
            />
            <TextInput
                label="Email"
                placeholder="Email"
                {...form.getInputProps("email")}
                required
                mb="sm"
            />
            <Select
                label="Assign User"
                placeholder="Optional"
                data={userOptions}
                {...form.getInputProps("assigned_user_id")}
                searchable
                clearable
                mb="sm"
            />
            <Button type="submit" fullWidth>
                Create Client
            </Button>
        </form>
    </Modal>
  );
}