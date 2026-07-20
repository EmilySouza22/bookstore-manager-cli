import { ClienteRepository } from '../repositories/ClienteRepository';
import { Cliente, ClienteProps } from '../models/Cliente';
import {
	ValidationError,
	NotFoundError,
	BusinessRuleError,
} from '../utils/errors';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_CPF = /^\d{11}$/;
const REGEX_TELEFONE = /^\d{10,11}$/;

export class ClienteService {
	private repository: ClienteRepository;

	constructor(repository: ClienteRepository = new ClienteRepository()) {
		this.repository = repository;
	}

	private validarDados(dados: Partial<ClienteProps>): void {
		if (dados.nome !== undefined && dados.nome.trim().length === 0) {
			throw new ValidationError('O nome do cliente e obrigatorio.');
		}
		if (dados.email !== undefined) {
			if (dados.email.trim().length === 0) {
				throw new ValidationError('O email do cliente e obrigatorio.');
			}
			if (!REGEX_EMAIL.test(dados.email)) {
				throw new ValidationError('O email informado e invalido.');
			}
		}
		if (
			dados.cpf !== undefined &&
			dados.cpf !== null &&
			dados.cpf.trim().length > 0
		) {
			if (!REGEX_CPF.test(dados.cpf.replace(/\D/g, ''))) {
				throw new ValidationError(
					'O CPF informado e invalido. Use apenas numeros (11 digitos).',
				);
			}
		}
		if (
			dados.telefone !== undefined &&
			dados.telefone !== null &&
			dados.telefone.trim().length > 0
		) {
			if (!REGEX_TELEFONE.test(dados.telefone.replace(/\D/g, ''))) {
				throw new ValidationError('O telefone informado e invalido.');
			}
		}
	}

	/** Converte erros de violacao de unicidade do PostgreSQL (email/cpf duplicado) em erro de negocio legivel. */
	private tratarErroDuplicidade(error: unknown): never {
		const pgError = error as { code?: string; constraint?: string };
		if (pgError.code === '23505') {
			if (pgError.constraint?.includes('email')) {
				throw new BusinessRuleError(
					'Ja existe um cliente cadastrado com este email.',
				);
			}
			if (pgError.constraint?.includes('cpf')) {
				throw new BusinessRuleError(
					'Ja existe um cliente cadastrado com este CPF.',
				);
			}
			throw new BusinessRuleError(
				'Ja existe um cliente cadastrado com estes dados.',
			);
		}
		throw error;
	}

	public async cadastrar(dados: ClienteProps): Promise<Cliente> {
		this.validarDados(dados);
		try {
			return await this.repository.criar(dados);
		} catch (error) {
			this.tratarErroDuplicidade(error);
		}
	}

	public async listarTodos(): Promise<Cliente[]> {
		return this.repository.listarTodos();
	}

	public async buscarPorId(id: number): Promise<Cliente> {
		const cliente = await this.repository.buscarPorId(id);
		if (!cliente) {
			throw new NotFoundError(`Cliente com id ${id} nao foi encontrado.`);
		}
		return cliente;
	}

	public async atualizar(
		id: number,
		dados: Partial<ClienteProps>,
	): Promise<Cliente> {
		this.validarDados(dados);
		await this.buscarPorId(id);

		try {
			const clienteAtualizado = await this.repository.atualizar(id, dados);
			if (!clienteAtualizado) {
				throw new NotFoundError(`Cliente com id ${id} nao foi encontrado.`);
			}
			return clienteAtualizado;
		} catch (error) {
			if (error instanceof NotFoundError) throw error;
			this.tratarErroDuplicidade(error);
		}
	}

	public async remover(id: number): Promise<void> {
		await this.buscarPorId(id);

		const possuiEmprestimos =
			await this.repository.possuiEmprestimosVinculados(id);
		if (possuiEmprestimos) {
			throw new BusinessRuleError(
				'Nao e possivel remover este cliente: existem emprestimos vinculados a ele.',
			);
		}

		await this.repository.remover(id);
	}
}
