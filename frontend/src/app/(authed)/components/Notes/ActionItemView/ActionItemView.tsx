import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

import { Note } from "@/types/notes";
import styles from "./ActionItemView.module.scss";


interface ActionItemProps {
  notes: Note[];
  onSelect: (note: Note) => void;
  onCreate: () => void;
}

export default function ActionItemView({ notes, onSelect, onCreate }: ActionItemProps) {
    return (
    <Card withBorder shadow="sm" className={styles.ActionItemCard}>
        <Stack gap="sm">
            <Group justify="space-between" align="center">
                <Text fw={600}>Action Items</Text>
                <Button size="xs" onClick={onCreate}>
                    +
                </Button>
            </Group>
            
            {notes.length === 0 && (
                <Text c="dimmed" size="sm" className={styles.EmptyText}>
                No action items
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
                <Stack gap="xs">
                    <Group justify="space-between">
                    <Badge color={note.status === "open" ? "green" : "red"}>
                        {note.status}
                    </Badge>
                    {note.due_date && (
                        <Text size="sm" c="dimmed">
                        Due: {new Date(note.due_date).toLocaleDateString()}
                        </Text>
                    )}
                    </Group>

                    <Text className={styles.Content}>{note.content}</Text>

                    <Text size="sm" c="dimmed">
                    Created by: {note.creator.email}
                    </Text>
                </Stack>
                </Card>
            ))}
        </Stack>
    </Card>
    );
    }