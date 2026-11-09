import { Button, Group, Stack, TextInput } from '@mantine/core';
import { FloppyDisk, X } from '@phosphor-icons/react';
import type { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import type { Author } from '../types/book';
import { GenericModal } from './GenericModal';
import { useAuthorForm, type AuthorFormData } from './useAuthorForm';

interface AuthorFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Chamado quando a API indica que os autores exibidos estão desatualizados (404/409)
  onOutdatedData?: () => void;
  authorToEdit: Author | null;
}

interface AuthorFormContentProps {
  form: UseFormReturnType<AuthorFormData>;
  onSubmit: (values: AuthorFormData) => Promise<void>;
  onCancel?: () => void;
}

export function AuthorFormContent({ form, onSubmit, onCancel }: AuthorFormContentProps) {
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nome do Autor"
          placeholder="Ex: Machado de Assis"
          withAsterisk
          {...form.getInputProps('name')}
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

export function AuthorFormModal({
  opened,
  onClose,
  onSaved,
  onOutdatedData,
  authorToEdit,
}: AuthorFormModalProps) {
  const { form, resetForm, submitForm } = useAuthorForm();
  const authorFormValues = useMemo(
    () => (authorToEdit ? { name: authorToEdit.name } : null),
    [authorToEdit]
  );
  const { reset, setValues } = form;

  useEffect(() => {
    if (!opened) {
      return;
    }

    if (authorFormValues) {
      setValues(authorFormValues);
      return;
    }

    reset();
  }, [authorFormValues, opened, reset, setValues]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: AuthorFormData) =>
    submitForm(
      values,
      authorToEdit,
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
      title={authorToEdit ? 'Editar Autor' : 'Cadastrar Novo Autor'}
    >
      <AuthorFormContent form={form} onSubmit={handleSubmit} onCancel={handleClose} />
    </GenericModal>
  );
}
