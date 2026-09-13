import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { StatsContainer } from '../components/StatusContainer';
import { mockDashboardStatsData } from '../services/mockData';

interface DashboardPageProps {
  onAddBook: () => void;
}

export function DashboardPage({ onAddBook }: DashboardPageProps) {
  return (
    <Stack gap="lg">
      <Title order={1}>Dashboard</Title>
      <Text c="dimmed" size="sm">
        Bem vindo ao sistema de gerenciamento da biblioteca!
      </Text>

      <StatsContainer data={mockDashboardStatsData} />

      <div>
        <Title order={2} size="h3" mb="sm">
          Ações Rápidas
        </Title>
        <Group justify="flex-start" align="center">
          <Button onClick={onAddBook} color="blue" style={{ alignSelf: 'flex-start' }}>
            + Cadastrar Novo Livro
          </Button>
        </Group>
      </div>
    </Stack>
  );
}
