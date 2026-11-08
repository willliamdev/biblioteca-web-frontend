import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { FloppyDisk, X } from '@phosphor-icons/react';
import type { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import type { Author, Book, Genre } from '../types/book';
import { GenericModal } from './GenericModal';
import { useBookForm, type BookFormData } from './useBookForm';

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Chamado quando a API indica que livros/autores/gêneros exibidos estão desatualizados (404/409)
  onOutdatedData?: () => void;
  bookToEdit: Book | null;
  authors: Author[];
  genres: Genre[];
}

interface BookFormContentProps {
  form: UseFormReturnType<BookFormData>;
  authors: Author[];
  genres: Genre[];
  onSubmit: (values: BookFormData) => Promise<void>;
  onCancel?: () => void;
}

export function BookFormContent({
  form,
  authors,
  genres,
  onSubmit,
  onCancel,
}: BookFormContentProps) {
  const authorOptions = useMemo(
    () => authors.map((author) => ({ value: String(author.id), label: author.name })),
    [authors]
  );
  const genreOptions = useMemo(
    () => genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
    [genres]
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Título do Livro"
          placeholder="Ex: Dom Casmurro"
          withAsterisk
          {...form.getInputProps('title')}
        />

        <Select
          label="Autor"
          placeholder="Selecione o autor"
          data={authorOptions}
          searchable
          nothingFoundMessage="Nenhum autor encontrado"
          withAsterisk
          {...form.getInputProps('authorId')}
        />

        <Select
          label="Gênero"
          placeholder="Selecione o gênero"
          data={genreOptions}
          searchable
          nothingFoundMessage="Nenhum gênero encontrado"
          withAsterisk
          {...form.getInputProps('genreId')}
        />

        <TextInput
          label="Data de lançamento"
          type="date"
          withAsterisk
          {...form.getInputProps('publicationDate')}
        />

        <TextInput
          label="Editora"
          placeholder="Ex: Companhia das Letras"
          withAsterisk
          {...form.getInputProps('publisher')}
        />

        <Group justify="flex-end" mt="md">
          {onCancel ? (
            <Button
              variant="default"
              onClick={onCancel}
              type="button"
              leftSection={<X size={16} aria-hidden="true" />}
            >
              Cancelar
            </Button>
          ) : null}
          <Button
            type="submit"
            color="bibliotecaOrange"
            loading={form.submitting}
            leftSection={<FloppyDisk size={16} aria-hidden="true" />}
          >
            Salvar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function BookFormModal({
  opened,
  onClose,
  onSaved,
  onOutdatedData,
  bookToEdit,
  authors,
  genres,
}: BookFormModalProps) {
  const { form, resetForm, submitForm } = useBookForm();
  const bookFormValues = useMemo(
    () =>
      bookToEdit
        ? {
            title: bookToEdit.title,
            authorId: String(bookToEdit.author.id),
            genreId: String(bookToEdit.genre.id),
            publicationDate: bookToEdit.publicationDate,
            publisher: bookToEdit.publisher,
          }
        : null,
    [bookToEdit]
  );
  const { reset, setValues } = form;

  useEffect(() => {
    if (!opened) {
      return;
    }

    if (bookFormValues) {
      setValues(bookFormValues);
      return;
    }

    reset();
  }, [bookFormValues, opened, reset, setValues]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: BookFormData) =>
    submitForm(
      values,
      bookToEdit,
      () => {
        onSaved();
        handleClose();
      },
      onOutdatedData
    );

  return (
    <GenericModal
      opened={opened}
      onClose={handleClose}
      title={bookToEdit ? 'Editar Livro' : 'Cadastrar Novo Livro'}
    >
      <BookFormContent
        form={form}
        authors={authors}
        genres={genres}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </GenericModal>
  );
}
