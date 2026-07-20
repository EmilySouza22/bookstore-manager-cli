import { AutorRepository } from '../repositories/AutorRepository';
import { Autor, AutorProps } from '../models/Autor';
import {
	ValidationError,
	NotFoundError,
	BusinessRuleError,
} from '../utils/errors';

export class AutorService {
	private repository: AutorRepository;

	constructor(repository: AutorRepository = new AutorRepository()) {
		this.repository = repository;
	}

	private validarDados(dados: Partial<AutorProps>): void {
		if (dados.nome !== undefined && dados.nome.trim().length === 0) {
			throw new ValidationError('O nome do autor e obrigatorio.');
		}
	}

	public async cadastrar(dados: AutorProps): Promise<Autor> {
		this.validarDados(dados);
		return this.repository.criar(dados);
	}

	public async listarTodos(): Promise<Autor[]> {
		return this.repository.listarTodos();
	}

	public async buscarPorId(id: number): Promise<Autor> {
		const autor = await this.repository.buscarPorId(id);
		if (!autor) {
			throw new NotFoundError(`Autor com id ${id} nao foi encontrado.`);
		}
		return autor;
	}

	public async atualizar(
		id: number,
		dados: Partial<AutorProps>,
	): Promise<Autor> {
		this.validarDados(dados);
		await this.buscarPorId(id); // garante que existe (lanca NotFoundError caso contrario)

		const autorAtualizado = await this.repository.atualizar(id, dados);
		if (!autorAtualizado) {
			throw new NotFoundError(`Autor com id ${id} nao foi encontrado.`);
		}
		return autorAtualizado;
	}

	public async remover(id: number): Promise<void> {
		await this.buscarPorId(id); // garante que existe

		const possuiLivros = await this.repository.possuiLivrosVinculados(id);
		if (possuiLivros) {
			throw new BusinessRuleError(
				'Nao e possivel remover este autor: existem livros cadastrados vinculados a ele.',
			);
		}

		await this.repository.remover(id);
	}
}
