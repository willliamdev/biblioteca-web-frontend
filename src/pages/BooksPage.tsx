import { Badge, Button, Group, Stack, Table, Text, Title } from '@mantine/core';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import styles from './BooksPage.module.css';
import type { Book } from '../types/book';

interface BooksPageProps {
  books: Book[];
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

export function BooksPage({ books, onAddBook, onEditBook, onDeleteBook }: BooksPageProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Livros</Title>
        <Button
          onClick={onAddBook}
          color="bibliotecaOrange"
          leftSection={<Plus size={16} aria-hidden="true" />}
        >
          Cadastrar Livro
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Gênero</Table.Th>
              <Table.Th>Autor</Table.Th>
              <Table.Th>Lançamento</Table.Th>
              <Table.Th>Editora</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {books.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum livro cadastrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {books.map((book) => (
              <Table.Tr key={book.id} className={styles.bookRow}>
                <Table.Td>{book.title}</Table.Td>
                <Table.Td>{book.genre.name}</Table.Td>
                <Table.Td>{book.author.name}</Table.Td>
                <Table.Td>{dayjs(book.publicationDate).format('DD/MM/YYYY')}</Table.Td>
                <Table.Td>{book.publisher}</Table.Td>
                <Table.Td>
                  <Badge color={book.available ? 'green' : 'orange'} variant="light">
                    {book.available ? 'Disponível' : 'Emprestado'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" className={styles.rowActions} wrap="nowrap">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      onClick={() => onEditBook(book)}
                      aria-label={`Editar ${book.title}`}
                      leftSection={<PencilSimple size={14} aria-hidden="true" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteBook(book)}
                      aria-label={`Excluir ${book.title}`}
                      leftSection={<Trash size={14} aria-hidden="true" />}
                    >
                      Excluir
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
