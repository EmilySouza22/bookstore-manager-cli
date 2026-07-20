import pool from '../database/connection';

export interface LivroDisponivelRow {
	id: number;
	titulo: string;
	quantidadeDisponivel: number;
	quantidadeTotal: number;
}

export interface LivroEmprestadoRow {
	id: number;
	titulo: string;
	clienteNome: string;
	dataEmprestimo: Date;
}

export interface LivrosPorAutorRow {
	autorNome: string;
	quantidadeLivros: number;
}

export interface EmprestimosPorLivroRow {
	livroTitulo: string;
	totalEmprestimos: number;
}

export interface ClienteComEmprestimoAtivoRow {
	id: number;
	nome: string;
	email: string;
	quantidadeEmprestimosAtivos: number;
}

export class RelatorioRepository {
	public async livrosDisponiveis(): Promise<LivroDisponivelRow[]> {
		const resultado = await pool.query(
			`SELECT id, titulo, quantidade_disponivel, quantidade_total
       FROM livros
       WHERE quantidade_disponivel > 0
       ORDER BY titulo ASC`,
		);
		return resultado.rows.map((row) => ({
			id: row.id,
			titulo: row.titulo,
			quantidadeDisponivel: row.quantidade_disponivel,
			quantidadeTotal: row.quantidade_total,
		}));
	}

	public async livrosEmprestados(): Promise<LivroEmprestadoRow[]> {
		const resultado = await pool.query(
			`SELECT l.id, l.titulo, c.nome AS cliente_nome, e.data_emprestimo
       FROM emprestimos e
       INNER JOIN livros l ON l.id = e.livro_id
       INNER JOIN clientes c ON c.id = e.cliente_id
       WHERE e.status = 'ATIVO'
       ORDER BY e.data_emprestimo DESC`,
		);
		return resultado.rows.map((row) => ({
			id: row.id,
			titulo: row.titulo,
			clienteNome: row.cliente_nome,
			dataEmprestimo: row.data_emprestimo,
		}));
	}

	public async livrosPorAutor(): Promise<LivrosPorAutorRow[]> {
		const resultado = await pool.query(
			`SELECT a.nome AS autor_nome, COUNT(l.id)::int AS quantidade_livros
       FROM autores a
       LEFT JOIN livros l ON l.autor_id = a.id
       GROUP BY a.id, a.nome
       ORDER BY a.nome ASC`,
		);
		return resultado.rows.map((row) => ({
			autorNome: row.autor_nome,
			quantidadeLivros: row.quantidade_livros,
		}));
	}

	public async emprestimosPorLivro(): Promise<EmprestimosPorLivroRow[]> {
		const resultado = await pool.query(
			`SELECT l.titulo AS livro_titulo, COUNT(e.id)::int AS total_emprestimos
       FROM livros l
       INNER JOIN emprestimos e ON e.livro_id = l.id
       GROUP BY l.id, l.titulo
       ORDER BY total_emprestimos DESC
       LIMIT 10`,
		);
		return resultado.rows.map((row) => ({
			livroTitulo: row.livro_titulo,
			totalEmprestimos: row.total_emprestimos,
		}));
	}

	public async clientesComEmprestimosAtivos(): Promise<
		ClienteComEmprestimoAtivoRow[]
	> {
		const resultado = await pool.query(
			`SELECT c.id, c.nome, c.email, COUNT(e.id)::int AS quantidade_emprestimos_ativos
       FROM clientes c
       INNER JOIN emprestimos e ON e.cliente_id = c.id
       WHERE e.status = 'ATIVO'
       GROUP BY c.id, c.nome, c.email
       ORDER BY c.nome ASC`,
		);
		return resultado.rows.map((row) => ({
			id: row.id,
			nome: row.nome,
			email: row.email,
			quantidadeEmprestimosAtivos: row.quantidade_emprestimos_ativos,
		}));
	}
}
