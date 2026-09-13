import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { GenericModal } from './GenericModal';
import { useBookForm, type BookFormData } from './useBookForm';

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
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

        <TextInput
          label="ISBN"
          placeholder="Ex: 978-8535902778"
          withAsterisk
          {...form.getInputProps('isbn')}
        />

        <Select
          label="Categoria"
          placeholder="Selecione uma categoria"
          data={['Romance', 'Ficção Científica', 'História', 'Tecnologia']}
          withAsterisk
          {...form.getInputProps('category')}
        />

        <NumberInput
          label="Quantidade de Exemplares"
          min={1}
          withAsterisk
          {...form.getInputProps('copies')}
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

export function BookFormModal({ opened, onClose }: BookFormModalProps) {
  const { form, resetForm, submitForm } = useBookForm();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: BookFormData) => {
    submitForm(values, handleClose);
  };

  return (
    <GenericModal opened={opened} onClose={handleClose} title="Cadastrar Novo Livro">
      <BookFormContent form={form} onSubmit={handleSubmit} onCancel={handleClose} />
    </GenericModal>
  );
}
