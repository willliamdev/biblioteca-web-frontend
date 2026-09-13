import { Button, Container, Title, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BookFormModal } from './components/BookFormModal';
import { WidgetContainer } from './components/WidgetContainer';
import { mockDashboardData } from './services/mockData';

export default function App() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Biblioteca dos Guri
      </Title>
      <Group mb="xl" justify="center">
        {/* total de livros, total emprestimos, empréstimos atrasados */}
        <WidgetContainer data={mockDashboardData} />
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
