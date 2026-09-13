import { Card, Title, Text } from '@mantine/core';

export interface WidgetProps {
  title: string;
  value: string | number;
  description: string;
  color?: string;
}

export function Widget({ title, value, description, color }: WidgetProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" flex="1" withBorder>
      <Title order={3} fw={500} size="md">
        {title}
      </Title>
      <Text size="xl" fw={700} c={color? color : 'green'}>
        {value}
      </Text>
      <Text size="xs" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}