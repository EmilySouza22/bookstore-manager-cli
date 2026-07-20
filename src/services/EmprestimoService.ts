import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { Emprestimo, StatusEmprestimo } from '../models/Emprestimo';
import { EmprestimoDetalhado } from '../utils/dataMappers';
import {
	ValidationError,
	NotFoundError,
	BusinessRuleError,
} from '../utils/errors';

export class EmprestimoService {
	private repository: EmprestimoRepository;
	private livroRepository: LivroRepository;
	private clienteRepository: ClienteRepository;

	constructor(
		repository: EmprestimoRepository = new EmprestimoRepository(),
		livroRepository: LivroRepository = new LivroRepository(),
		clienteRepository: ClienteRepository = new ClienteRepository(),
	) {
		this.repository = repository;
		this.livroRepository = livroRepository;
		this.clienteRepository = clienteRepository;
	}

	/** RF10 - Realiza um emprestimo, validando livro, cliente e disponibilidade. */
	public async realizarEmprestimo(
		livroId: number,
		clienteId: number,
		dataDevolucaoPrevista?: Date | null,
	): Promise<Emprestimo> {
		if (!livroId) throw new ValidationError('O id do livro e obrigatorio.');
		if (!clienteId) throw new ValidationError('O id do cliente e obrigatorio.');

		const livro = await this.livroRepository.buscarPorId(livroId);
		if (!livro) {
			throw new NotFoundError(`Livro com id ${livroId} nao foi encontrado.`);
		}

		const cliente = await this.clienteRepository.buscarPorId(clienteId);
		if (!cliente) {
			throw new NotFoundError(
				`Cliente com id ${clienteId} nao foi encontrado.`,
			);
		}

		if (!livro.estaDisponivel()) {
			throw new BusinessRuleError(
				`O livro "${livro.titulo}" nao possui exemplares disponiveis no momento.`,
			);
		}

		const emprestimo = await this.repository.criar({
			livroId,
			clienteId,
			dataDevolucaoPrevista,
		});

		await this.livroRepository.ajustarQuantidadeDisponivel(livroId, -1);

		return emprestimo;
	}

	/** RF11 - Registra a devolucao de um emprestimo ativo. */
	public async registrarDevolucao(emprestimoId: number): Promise<Emprestimo> {
		const emprestimo = await this.repository.buscarPorId(emprestimoId);
		if (!emprestimo) {
			throw new NotFoundError(
				`Emprestimo com id ${emprestimoId} nao foi encontrado.`,
			);
		}

		if (emprestimo.status === StatusEmprestimo.DEVOLVIDO) {
			throw new BusinessRuleError(
				'Este emprestimo ja foi devolvido anteriormente.',
			);
		}

		const emprestimoAtualizado =
			await this.repository.marcarComoDevolvido(emprestimoId);
		await this.livroRepository.ajustarQuantidadeDisponivel(
			emprestimo.livroId,
			1,
		);

		return emprestimoAtualizado;
	}

	/** RF12 - Consulta emprestimos com dados do livro e do cliente. */
	public async listarTodosDetalhado(): Promise<EmprestimoDetalhado[]> {
		return this.repository.listarTodosDetalhado();
	}
}
