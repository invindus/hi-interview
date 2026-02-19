"use client";

import { Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";

import styles from "./page.module.scss";

export default function ClientDetailsPage() {
    const { clientId } = useParams();
    const api = useApi();
    const [client, setClient] = useState<Client>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!clientId) return;

        const id = Array.isArray(clientId) ? clientId[0] : clientId; // TS doesn't know in advance if a param is a string or array

        api.clients.getClient(id)
            .then(setClient)
            .finally(() => setLoading(false));
    }, [api, clientId]);

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!client) {
        return <div className={styles.container}>Client not found</div>;
    }

    return (
        <div className={styles.container}>
            <Title 
                order={2} 
                className={styles.title}
            >
                {client.first_name} {client.last_name}
            </Title>
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
        </div>
    );
}