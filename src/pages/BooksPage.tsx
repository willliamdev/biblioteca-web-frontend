import { Button, Group, Stack, Table, Title } from '@mantine/core';
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
        <Button onClick={onAddBook} color="blue">
          + Cadastrar Livro
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Gênero</Table.Th>
              <Table.Th>Autor</Table.Th>
              <Table.Th>Lançamento</Table.Th>
              <Table.Th>Editora</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {books.map((book) => (
              <Table.Tr key={book.id} className={styles.bookRow}>
                <Table.Td>{book.title}</Table.Td>
                <Table.Td>{book.genre.name}</Table.Td>
                <Table.Td>{book.author.name}</Table.Td>
                <Table.Td>{dayjs(book.publicationDate).format('DD/MM/YYYY')}</Table.Td>
                <Table.Td>{book.publisher}</Table.Td>
                <Table.Td>
                  <Group gap="xs" className={styles.rowActions} wrap="nowrap">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      onClick={() => onEditBook(book)}
                      aria-label={`Editar ${book.title}`}
                    >
                      Editar
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteBook(book)}
                      aria-label={`Excluir ${book.title}`}
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
