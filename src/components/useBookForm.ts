import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
}

export function useBookForm() {
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

  const resetForm = () => {
    form.reset();
  };

  const submitForm = (values: BookFormData, onSuccess?: () => void) => {
    console.log('Submit book payload:', values);

    notifications.show({
      title: 'Sucesso!',
      message: `O livro "${values.title}" foi cadastrado com sucesso.`,
      color: 'green',
    });

    resetForm();
    onSuccess?.();
  };

  return {
    form,
    resetForm,
    submitForm,
  };
}
