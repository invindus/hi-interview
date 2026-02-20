import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

import { Note } from "@/types/notes";
import styles from "./SummaryView.module.scss";


interface SummaryProps {
  notes: Note[];
  onSelect: (note: Note) => void;
  onCreate: () => void;
}

export default function SummaryView({ notes, onSelect, onCreate }: SummaryProps) {
    return (
    <Card withBorder shadow="sm" className={styles.SummaryCard}>
        <Stack gap="sm">
            <Group justify="space-between" align="center">
                <Text fw={600}>Summaries</Text>
                <Button size="xs" onClick={onCreate}>
                    +
                </Button>
            </Group>

            {notes.length === 0 && (
                <Text c="dimmed" size="sm" className={styles.EmptyText}>
                No summaries
                </Text>
            )}

            {notes.map(note => (
                <Card
                    key={note.id}
                    withBorder
                    shadow="xs"
                    className={styles.NoteItem}
                    onClick={() => onSelect(note)}
                >
                    <Badge color="gray">Summary</Badge>
                    <Text mt="sm" className={styles.Content}>
                        {note.content}
                    </Text>

                    <Text size="sm" c="dimmed">
                        Created by: {note.creator.email}
                    </Text>
                </Card>
            ))}
        </Stack>
    </Card>
    );
}