import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

import { Note } from "@/types/notes";
import styles from "./ReminderView.module.scss";

interface ReminderProps {
  notes: Note[];
  onSelect: (note: Note) => void;
  onCreate: () => void;
}

export default function ReminderView({ notes, onSelect, onCreate }: ReminderProps) {
    return (
    <Card withBorder shadow="sm" className={styles.ReminderCard}>
        <Stack gap="sm">
            <Group justify="space-between" align="center">
                <Text fw={600}>Reminders</Text>
                <Button size="xs" onClick={onCreate}>
                    +
                </Button>
            </Group>

            {notes.length === 0 && (
                <Text c="dimmed" size="sm" className={styles.EmptyText}>
                No reminders
                </Text>
            )}

            {notes.map((note) => (
                <Card
                    key={note.id}
                    withBorder
                    shadow="xs"
                    className={styles.NoteItem}
                    onClick={() => onSelect(note)}
                >
                <Stack gap="xs">
                    <Group justify="space-between">
                    <Badge color="yellow" variant="filled">
                        Reminder
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