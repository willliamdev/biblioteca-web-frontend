import { useForm } from '@mantine/form';
import { isOutdatedDataError } from '../services/api';
import { authorService } from '../services/authorService';
import type { Author, CreateAuthorDTO } from '../types/book';
import { handleFormError, notifySuccess } from '../utils/feedback';

export interface AuthorFormData {
  name: string;
}

export function useAuthorForm() {
  const form = useForm<AuthorFormData>({
    initialValues: {
      name: '',
    },

    validate: {
      name: (value) => {
        const name = value.trim();

        if (name.length < 2) {
          return 'O nome deve ter pelo menos 2 caracteres';
        }

        return name.length > 255 ? 'O nome deve ter no máximo 255 caracteres' : null;
      },
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (
    values: AuthorFormData,
    authorToEdit: Author | null,
    onSuccess?: () => void,
    onOutdatedData?: () => void
  ) => {
    const payload: CreateAuthorDTO = {
      name: values.name.trim(),
    };

    try {
      const savedAuthor = authorToEdit
        ? await authorService.update(authorToEdit.id, payload)
        : await authorService.create(payload);

      notifySuccess(
        'Sucesso!',
        authorToEdit
          ? `O autor "${savedAuthor.name}" foi atualizado com sucesso.`
          : `O autor "${savedAuthor.name}" foi cadastrado com sucesso. Cadastre ao menos um livro dele: pela regra do acervo, todo autor deve ter um livro.`
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      handleFormError(
        form,
        error,
        authorToEdit ? 'Não foi possível atualizar o autor' : 'Não foi possível cadastrar o autor'
      );

      // Ex.: o autor foi excluído em outra aba; recarrega as listas
      if (isOutdatedDataError(error)) {
        onOutdatedData?.();
      }
    }
  };

  return {
    form,
    resetForm,
    submitForm,
  };
}
