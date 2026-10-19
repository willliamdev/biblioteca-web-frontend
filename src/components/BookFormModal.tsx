import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import type { Book } from '../types/book';
import { GenericModal } from './GenericModal';
import { useBookForm, type BookFormData } from './useBookForm';

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
  onCreateBook: (values: BookFormData) => void;
  onUpdateBook: (bookId: number, values: BookFormData) => void;
  bookToEdit: Book | null;
}

interface BookFormContentProps {
  form: UseFormReturnType<BookFormData>;
  onSubmit: (values: BookFormData) => void;
  onCancel?: () => void;
}

export function BookFormContent({ form, onSubmit, onCancel }: BookFormContentProps) {
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Título do Livro"
          placeholder="Ex: Dom Casmurro"
          withAsterisk
          {...form.getInputProps('title')}
        />

        <TextInput
          label="Autor"
          placeholder="Ex: Machado de Assis"
          withAsterisk
          {...form.getInputProps('author')}
        />

        <Select
          label="Categoria"
          placeholder="Selecione uma categoria"
          data={[
            'Romance',
            'Ficção Científica',
            'História',
            'Tecnologia',
            'Literatura Brasileira',
            'Fantasia',
            'Distopia',
            'Mistério e Suspense',
            'Realismo Mágico',
          ]}
          withAsterisk
          {...form.getInputProps('category')}
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
            <Button variant="default" onClick={onCancel} type="button">
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" color="blue">
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
  onCreateBook,
  onUpdateBook,
  bookToEdit,
}: BookFormModalProps) {
  const { form, resetForm, submitForm } = useBookForm();
  const bookFormValues = useMemo(
    () =>
      bookToEdit
        ? {
            title: bookToEdit.title,
            author: bookToEdit.author.name,
            category: bookToEdit.genre.name,
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

  const handleSubmit = (values: BookFormData) => {
    submitForm(values, Boolean(bookToEdit), () => {
      if (bookToEdit) {
        onUpdateBook(bookToEdit.id, values);
      } else {
        onCreateBook(values);
      }
      handleClose();
    });
  };

  return (
    <GenericModal
      opened={opened}
      onClose={handleClose}
      title={bookToEdit ? 'Editar Livro' : 'Cadastrar Novo Livro'}
    >
      <BookFormContent form={form} onSubmit={handleSubmit} onCancel={handleClose} />
    </GenericModal>
  );
}
