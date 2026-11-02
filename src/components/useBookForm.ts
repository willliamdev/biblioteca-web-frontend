import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { isOutdatedDataError } from '../services/api';
import { BOOK_FIELD_ALIASES, bookService } from '../services/bookService';
import type { Book, CreateBookDTO } from '../types/book';
import { handleFormError, notifySuccess } from '../utils/feedback';

export interface BookFormData {
  title: string;
  authorId: string | null;
  genreId: string | null;
  publicationDate: string;
  publisher: string;
}

export function useBookForm() {
  const form = useForm<BookFormData>({
    initialValues: {
      title: '',
      authorId: null,
      genreId: null,
      publicationDate: '',
      publisher: '',
    },

    validate: {
      title: (value) => {
        const title = value.trim();

        if (title.length < 2) {
          return 'O título deve ter pelo menos 2 caracteres';
        }

        return title.length > 255 ? 'O título deve ter no máximo 255 caracteres' : null;
      },
      authorId: (value) => (!value ? 'Selecione o autor' : null),
      genreId: (value) => (!value ? 'Selecione o gênero' : null),
      publicationDate: (value) => {
        if (!value) {
          return 'Informe a data de lançamento';
        }

        return dayjs(value).isAfter(dayjs(), 'day')
          ? 'A data de lançamento não pode ser futura'
          : null;
      },
      publisher: (value) => (value.trim().length < 2 ? 'Informe o nome da editora' : null),
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (
    values: BookFormData,
    bookToEdit: Book | null,
    onSuccess?: () => void,
    onOutdatedData?: () => void
  ) => {
    const payload: CreateBookDTO = {
      title: values.title.trim(),
      authorId: Number(values.authorId),
      genreId: Number(values.genreId),
      publicationDate: values.publicationDate,
      publisher: values.publisher.trim(),
    };

    try {
      const savedBook = bookToEdit
        ? await bookService.update(bookToEdit.id, payload)
        : await bookService.create(payload);

      notifySuccess(
        'Sucesso!',
        bookToEdit
          ? `O livro "${savedBook.title}" foi atualizado com sucesso.`
          : `O livro "${savedBook.title}" foi cadastrado com sucesso.`
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      handleFormError(
        form,
        error,
        bookToEdit ? 'Não foi possível atualizar o livro' : 'Não foi possível cadastrar o livro',
        BOOK_FIELD_ALIASES
      );

      // Ex.: o livro, o autor ou o gênero foi excluído em outra aba; recarrega as listas
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
