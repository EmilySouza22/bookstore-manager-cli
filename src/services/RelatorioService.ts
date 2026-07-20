import {
	RelatorioRepository,
	LivroDisponivelRow,
	LivroEmprestadoRow,
	LivrosPorAutorRow,
	EmprestimosPorLivroRow,
	ClienteComEmprestimoAtivoRow,
} from '../repositories/RelatorioRepository';

export class RelatorioService {
	private repository: RelatorioRepository;

	constructor(repository: RelatorioRepository = new RelatorioRepository()) {
		this.repository = repository;
	}

	public async livrosDisponiveis(): Promise<LivroDisponivelRow[]> {
		return this.repository.livrosDisponiveis();
	}

	public async livrosEmprestados(): Promise<LivroEmprestadoRow[]> {
		return this.repository.livrosEmprestados();
	}

	public async livrosPorAutor(): Promise<LivrosPorAutorRow[]> {
		return this.repository.livrosPorAutor();
	}

	public async emprestimosPorLivro(): Promise<EmprestimosPorLivroRow[]> {
		return this.repository.emprestimosPorLivro();
	}

	public async clientesComEmprestimosAtivos(): Promise<
		ClienteComEmprestimoAtivoRow[]
	> {
		return this.repository.clientesComEmprestimosAtivos();
	}
}
