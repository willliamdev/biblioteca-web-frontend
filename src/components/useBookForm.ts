import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  publicationDate: string;
  publisher: string;
}

export function useBookForm() {
  const form = useForm<BookFormData>({
    initialValues: {
      title: '',
      author: '',
      category: '',
      publicationDate: '',
      publisher: '',
    },

    validate: {
      title: (value) =>
        value.trim().length < 2 ? 'O título deve ter pelo menos 2 caracteres' : null,
      author: (value) => (value.trim().length < 2 ? 'Informe o nome do autor' : null),
      category: (value) => (!value ? 'Selecione uma categoria' : null),
      publicationDate: (value) => (!value ? 'Informe a data de lançamento' : null),
      publisher: (value) => (value.trim().length < 2 ? 'Informe o nome da editora' : null),
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = (values: BookFormData, isEditing: boolean, onSuccess?: () => void) => {
    notifications.show({
      title: 'Sucesso!',
      message: isEditing
        ? `O livro "${values.title}" foi atualizado com sucesso.`
        : `O livro "${values.title}" foi cadastrado com sucesso.`,
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
