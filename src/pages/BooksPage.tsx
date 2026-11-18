import { Badge, Button, Group, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useSortableData } from '../hooks/useSortableData';
import styles from './BooksPage.module.css';
import type { Book } from '../types/book';

type BookSortKey = 'title' | 'genre' | 'author' | 'publicationDate' | 'publisher' | 'available';

interface BooksPageProps {
  books: Book[];
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

export function BooksPage({ books, onAddBook, onEditBook, onDeleteBook }: BooksPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const getSortValue = useCallback((book: Book, key: BookSortKey) => {
    switch (key) {
      case 'title':
        return book.title;
      case 'genre':
        return book.genre.name;
      case 'author':
        return book.author.name;
      case 'publicationDate':
        return book.publicationDate;
      case 'publisher':
        return book.publisher;
      case 'available':
        return book.available ? 'Disponível' : 'Emprestado';
    }
  }, []);
  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) return books;

    return books.filter((book) =>
      book.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearch)
    );
  }, [books, searchTerm]);
  const { sortedData, sortKey, direction, requestSort } = useSortableData(
    filteredBooks,
    getSortValue
  );
  const header = (key: BookSortKey, label: string) => (
    <SortableTableHeader
      label={label}
      active={sortKey === key}
      direction={direction}
      onSort={() => requestSort(key)}
    />
  );

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

      <TextInput
        placeholder="Buscar livro pelo título"
        aria-label="Buscar livro pelo título"
        leftSection={<MagnifyingGlass size={16} aria-hidden="true" />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        maw={400}
      />

      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {header('title', 'Título')}
              {header('genre', 'Gênero')}
              {header('author', 'Autor')}
              {header('publicationDate', 'Lançamento')}
              {header('publisher', 'Editora')}
              {header('available', 'Situação')}
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
            ) : filteredBooks.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum livro encontrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {sortedData.map((book) => (
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
