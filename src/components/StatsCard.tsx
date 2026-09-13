import { Card, Title, Text } from '@mantine/core';

export interface StatsProps {
  title: string;
  value: string | number;
  description: string;
  color?: string;
}

export function StatsCard({ title, value, description, color }: StatsProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder h="100%" w="100%">
      <Title order={3} fw={500} size="md">
        {title}
      </Title>
      <Text size="xl" fw={700} c={color ?? 'green'}>
        {value}
      </Text>
      <Text size="xs" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}
