import { Button, Group, Title } from '@mantine/core';

interface BooksPageProps {
  onAddBook: () => void;
}

export function BooksPage({ onAddBook }: BooksPageProps) {
  return (
    <Group justify="space-between" align="center">
      <Title order={1}>Livros</Title>
      <Button onClick={onAddBook} color="blue">
        + Cadastrar Livro
      </Button>
    </Group>
  );
}
