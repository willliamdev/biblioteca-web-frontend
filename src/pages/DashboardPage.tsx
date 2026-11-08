import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { BookOpen, Books, Plus } from '@phosphor-icons/react';
import type { StatsProps } from '../components/StatsCard';
import { StatsContainer } from '../components/StatusContainer';
import type { Author, Book } from '../types/book';
import type { Loan } from '../types/loan';

interface DashboardPageProps {
  books: Book[];
  authors: Author[];
  loans: Loan[];
  onAddBook: () => void;
  onAddAuthor: () => void;
  onAddLoan: () => void;
}

export function DashboardPage({
  books,
  authors,
  loans,
  onAddBook,
  onAddAuthor,
  onAddLoan,
}: DashboardPageProps) {
  const stats: StatsProps[] = [
    {
      title: 'Total de Livros',
      value: books.length,
      description: 'exemplares cadastrados',
    },
    {
      title: 'Empréstimos Ativos',
      value: loans.filter((loan) => loan.status === 'ATIVO').length,
      description: 'livros emprestados dentro do prazo',
    },
    {
      title: 'Empréstimos em Atraso',
      value: loans.filter((loan) => loan.status === 'ATRASADO').length,
      description: 'livros em atraso',
      color: 'red',
    },
    {
      title: 'Autores',
      value: authors.length,
      description: 'autores cadastrados',
      color: 'blue',
    },
  ];

  return (
    <Stack gap="lg">
      <Title order={1}>Dashboard</Title>
      <Text c="dimmed" size="sm">
        Bem vindo ao sistema de gerenciamento da biblioteca!
      </Text>

      <StatsContainer data={stats} />

      <div>
        <Title order={2} size="h3" mb="sm">
          Ações Rápidas
        </Title>
        <Group justify="flex-start" align="center">
          <Button
            onClick={onAddBook}
            color="blue"
            leftSection={<Plus size={16} aria-hidden="true" />}
          >
            Cadastrar Novo Livro
          </Button>
          <Button
            onClick={onAddAuthor}
            color="blue"
            variant="light"
            leftSection={<Books size={16} aria-hidden="true" />}
          >
            Cadastrar Autor
          </Button>
          <Button
            onClick={onAddLoan}
            color="blue"
            variant="light"
            leftSection={<BookOpen size={16} aria-hidden="true" />}
          >
            Novo Empréstimo
          </Button>
        </Group>
      </div>
    </Stack>
  );
}
