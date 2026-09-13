import { Button, Container, Title, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BookFormModal } from './components/BookFormModal';
import { StatsContainer } from './components/StatusContainer';
import { mockDashboardStatsData } from './services/mockData';

export default function App() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Dashboard
      </Title>
      <p>Bem vindo ao sistema de gerenciamento da biblioteca!</p>
      <Group mb="xl" justify="center">
        <StatsContainer data={mockDashboardStatsData} />
      </Group>
      <Group>
        <Button onClick={open} color="blue">
          Cadastrar Novo Livro
        </Button>
      </Group>

      <BookFormModal opened={opened} onClose={close} />
    </Container>
  );
}
