"use client";

import { Button, Checkbox, Divider, Group, Modal, Table, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";
import Notes from "@/app/(authed)/components/Notes/Notes";
import EditClientModal from "@/app/(authed)/components/EditClientModal/EditClientModal";
import DeleteClientModal from "@/app/(authed)/components/DeleteClientModal/DeleteClientModal";

import styles from "./page.module.scss";

export default function ClientDetailsPage() {
    const router = useRouter();
    const api = useApi();
    const { clientId } = useParams();
    const [client, setClient] = useState<Client>();
    const [loading, setLoading] = useState(true);
    const [editOpened, setEditOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
    });

    useEffect(() => {
        if (!clientId) return;

        const id = Array.isArray(clientId) ? clientId[0] : clientId; // TS doesn't know in advance if a param is a string or array

        api.clients.getClient(id)
            .then((data) => {
                setClient(data);
                setForm({
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                });
            })
            .finally(() => setLoading(false));
    }, [api, clientId]);

    // -----
    // Handle Functions
    // -----
    const handleUpdate = async () => {
        if (!client) return;

        const updated = await api.clients.getClient(client.id);
        setClient(updated);
        setEditOpened(false);
    };


    const handleDelete = async () => {
        if (!client) return;

        await api.clients.deleteClient(client.id);
        router.push("/clients");
    };


    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!client) {
        return <div className={styles.container}>Client not found</div>;
    }

    return (
        <div className={styles.container}>
            <Group justify="space-between" mb="md">
                <Title order={2} className={styles.title}>
                    {client.first_name} {client.last_name}
                </Title>

                <Group>
                    <Button onClick={() => setEditOpened(true)}>
                        Edit
                    </Button>
                    <Button
                        color="red"
                        variant="outline"
                        onClick={() => setDeleteOpened(true)}
                    >
                        Delete
                    </Button>
                </Group>
            </Group>

            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>Email</Table.Td>
                        <Table.Td>{client.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>First Name</Table.Td>
                        <Table.Td>{client.first_name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>Last Name</Table.Td>
                        <Table.Td>{client.last_name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>Assigned</Table.Td>
                        <Table.Td>{client.assigned_user_id ? "Yes" : "No"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>Created At</Table.Td>
                        <Table.Td>{new Date(client.created_at).toLocaleString()}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>Updated At</Table.Td>
                        <Table.Td>{new Date(client.updated_at).toLocaleString()}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>

            <Notes />

            <EditClientModal
                opened={editOpened}
                onClose={() => setEditOpened(false)}
                client={client}
                onSave={handleUpdate}
            />

            <DeleteClientModal
                opened={deleteOpened}
                onClose={() => setDeleteOpened(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}