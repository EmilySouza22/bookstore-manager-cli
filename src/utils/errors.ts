/**
 * Erro base da aplicacao. Erros que estendem esta classe sao tratados
 * pelos Controllers como erros "esperados" (regra de negocio/validacao),
 * exibindo apenas a mensagem ao usuario, sem interromper a aplicacao.
 */
export class AppError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AppError';
	}
}

/** Erro de validacao de dados de entrada (campos obrigatorios, formatos, etc). */
export class ValidationError extends AppError {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

/** Erro de registro nao encontrado (autor, livro, cliente ou emprestimo inexistente). */
export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

/** Erro de regra de negocio violada (ex: livro sem disponibilidade, registro duplicado). */
export class BusinessRuleError extends AppError {
	constructor(message: string) {
		super(message);
		this.name = 'BusinessRuleError';
	}
}
