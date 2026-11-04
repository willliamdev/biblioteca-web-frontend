export interface User {
  id: number;
  name: string;
  cpf: string;
  // em caso de não ter devolvido o livro até a data final.
  debtFree: boolean;
}

// DTO para cadastro/edição de usuário (o CPF pode ir com ou sem máscara)
export interface CreateUserDTO {
  name: string;
  cpf: string;
}
