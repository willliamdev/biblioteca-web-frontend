import { Modal, TextInput, NumberInput, Select, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
}

export function BookFormModal({ opened, onClose }: BookFormModalProps) {
  const form = useForm<BookFormData>({
    initialValues: {
      title: '',
      author: '',
      isbn: '',
      category: '',
      copies: 1,
    },

    validate: {
      title: (value) =>
        value.trim().length < 2 ? 'O título deve ter pelo menos 2 caracteres' : null,
      author: (value) => (value.trim().length < 2 ? 'Informe o nome do autor' : null),
      isbn: (value) => (value.trim().length < 10 ? 'ISBN inválido (mínimo 10 caracteres)' : null),
      category: (value) => (!value ? 'Selecione uma categoria' : null),
      copies: (value) => (value < 1 ? 'Deve haver pelo menos 1 exemplar' : null),
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values: BookFormData) => {
    console.log('Submit book payload:', values);

    notifications.show({
      title: 'Sucesso!',
      message: `O livro "${values.title}" foi cadastrado com sucesso.`,
      color: 'green',
    });

    handleClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Cadastrar Novo Livro" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
            <Button variant="default" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" color="blue">
              Salvar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
