import { LivroRepository } from '../repositories/LivroRepository';
import { AutorRepository } from '../repositories/AutorRepository';
import { Livro, LivroProps } from '../models/Livro';
import {
	ValidationError,
	NotFoundError,
	BusinessRuleError,
} from '../utils/errors';

export class LivroService {
	private repository: LivroRepository;
	private autorRepository: AutorRepository;

	constructor(
		repository: LivroRepository = new LivroRepository(),
		autorRepository: AutorRepository = new AutorRepository(),
	) {
		this.repository = repository;
		this.autorRepository = autorRepository;
	}

	private validarDados(dados: Partial<LivroProps>): void {
		if (dados.titulo !== undefined && dados.titulo.trim().length === 0) {
			throw new ValidationError('O titulo do livro e obrigatorio.');
		}
		if (dados.quantidadeTotal !== undefined && dados.quantidadeTotal < 0) {
			throw new ValidationError('A quantidade total nao pode ser negativa.');
		}
	}

	private async validarAutorExiste(autorId: number): Promise<void> {
		const autor = await this.autorRepository.buscarPorId(autorId);
		if (!autor) {
			throw new ValidationError(
				`Autor com id ${autorId} nao existe. Cadastre o autor antes de vincular o livro.`,
			);
		}
	}

	public async cadastrar(dados: LivroProps): Promise<Livro> {
		this.validarDados(dados);
		await this.validarAutorExiste(dados.autorId);

		// Ao cadastrar, a quantidade disponivel sempre comeca igual a quantidade total.
		return this.repository.criar({
			...dados,
			quantidadeDisponivel: dados.quantidadeTotal,
		});
	}

	public async listarTodos(): Promise<Livro[]> {
		return this.repository.listarTodos();
	}

	public async buscarPorId(id: number): Promise<Livro> {
		const livro = await this.repository.buscarPorId(id);
		if (!livro) {
			throw new NotFoundError(`Livro com id ${id} nao foi encontrado.`);
		}
		return livro;
	}

	public async atualizar(
		id: number,
		dados: Partial<LivroProps>,
	): Promise<Livro> {
		this.validarDados(dados);
		const livroAtual = await this.buscarPorId(id);

		if (dados.autorId !== undefined) {
			await this.validarAutorExiste(dados.autorId);
		}

		let dadosParaAtualizar = { ...dados };

		if (dados.quantidadeTotal !== undefined) {
			const emprestados =
				livroAtual.quantidadeTotal - livroAtual.quantidadeDisponivel;
			const novoDisponivel = dados.quantidadeTotal - emprestados;

			if (novoDisponivel < 0) {
				throw new ValidationError(
					`Nao e possivel reduzir a quantidade total para ${dados.quantidadeTotal}: ` +
						`ja existem ${emprestados} exemplar(es) emprestado(s).`,
				);
			}

			dadosParaAtualizar.quantidadeDisponivel = novoDisponivel;
		}

		const livroAtualizado = await this.repository.atualizar(
			id,
			dadosParaAtualizar,
		);
		if (!livroAtualizado) {
			throw new NotFoundError(`Livro com id ${id} nao foi encontrado.`);
		}
		return livroAtualizado;
	}

	public async remover(id: number): Promise<void> {
		await this.buscarPorId(id);

		const possuiEmprestimos =
			await this.repository.possuiEmprestimosVinculados(id);
		if (possuiEmprestimos) {
			throw new BusinessRuleError(
				'Nao e possivel remover este livro: existem emprestimos vinculados a ele.',
			);
		}

		await this.repository.remover(id);
	}
}
