"use client";

import { Button, Group, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";
import CreateClientModal from "@/app/(authed)/components/CreateClientModal/CreateClientModal";

import styles from "./page.module.scss";

export default function ClientsPage() {
    const router = useRouter();
    const api = useApi();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        api.clients.listClients()
            .then(setClients)
            .finally(() => setLoading(false));
    }, [api]);

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <Group justify="space-between" style={{ marginBottom: 20 }}>
                <Title order={2} className={styles.title}>
                    Clients
                </Title>
                <Button onClick={() => setModalOpened(true)}>Create Client</Button>
            </Group>

            <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Assigned</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {clients.map(client => (
                        <Table.Tr 
                            key={client.id}
                            style={{cursor: "pointer"}}
                            onClick={() => router.push(`/clients/${client.id}`)}
                        >
                            <Table.Td>{client.first_name} {client.last_name}</Table.Td>
                            <Table.Td>{client.email}</Table.Td>
                            <Table.Td>{client.assigned_user_id ? "Yes" : "No"}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <CreateClientModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onClientCreated={(newClient) => setClients(prev => [...prev, newClient])}
            />
        </div>
    );
}
