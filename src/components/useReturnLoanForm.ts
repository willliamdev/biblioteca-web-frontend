import { useForm } from '@mantine/form';
import { isOutdatedDataError } from '../services/api';
import { loanService } from '../services/loanService';
import type { Loan } from '../types/loan';
import { handleFormError, notifySuccess } from '../utils/feedback';
import { formatDate, todayIso } from '../utils/format';

export interface ReturnLoanFormData {
  returnDate: string;
}

export function getDefaultReturnLoanValues(): ReturnLoanFormData {
  return { returnDate: todayIso() };
}

// Registra a devolução com a data efetiva (padrão: hoje), permitindo lançar devoluções retroativas
export function useReturnLoanForm(loan: Loan | null) {
  const form = useForm<ReturnLoanFormData>({
    initialValues: getDefaultReturnLoanValues(),

    validate: {
      returnDate: (value) => {
        if (!value) {
          return 'Informe a data da devolução';
        }

        if (value > todayIso()) {
          return 'A data de devolução não pode ser futura';
        }

        return loan && value < loan.startDate
          ? 'A data de devolução não pode ser anterior à data do empréstimo'
          : null;
      },
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (
    values: ReturnLoanFormData,
    onSuccess?: () => void,
    onOutdatedData?: () => void
  ) => {
    if (!loan) {
      return;
    }

    try {
      const returnedLoan = await loanService.returnBook(loan.id, { returnDate: values.returnDate });

      notifySuccess(
        'Devolução registrada',
        `O livro "${returnedLoan.book.title}" foi devolvido em ${formatDate(returnedLoan.returnDate)}.`
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      handleFormError(form, error, 'Não foi possível registrar a devolução');

      // Ex.: a devolução já tinha sido registrada em outra aba; atualiza a lista
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
