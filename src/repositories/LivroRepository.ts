import pool from '../database/connection';
import { Livro, LivroProps } from '../models/Livro';
import { mapLivroRowToModel } from '../utils/dataMappers';

export class LivroRepository {
	public async criar(dados: LivroProps): Promise<Livro> {
		const resultado = await pool.query(
			`INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, preco, autor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
			[
				dados.titulo,
				dados.isbn ?? null,
				dados.anoPublicacao ?? null,
				dados.quantidadeTotal,
				dados.quantidadeDisponivel,
				dados.preco ?? null,
				dados.autorId,
			],
		);
		return mapLivroRowToModel(resultado.rows[0]);
	}

	public async listarTodos(): Promise<Livro[]> {
		const resultado = await pool.query(
			`SELECT * FROM livros ORDER BY titulo ASC`,
		);
		return resultado.rows.map(mapLivroRowToModel);
	}

	public async buscarPorId(id: number): Promise<Livro | null> {
		const resultado = await pool.query(`SELECT * FROM livros WHERE id = $1`, [
			id,
		]);
		if (resultado.rows.length === 0) return null;
		return mapLivroRowToModel(resultado.rows[0]);
	}

	public async atualizar(
		id: number,
		dados: Partial<LivroProps>,
	): Promise<Livro | null> {
		const atual = await this.buscarPorId(id);
		if (!atual) return null;

		const resultado = await pool.query(
			`UPDATE livros
       SET titulo = $1, isbn = $2, ano_publicacao = $3, quantidade_total = $4,
           quantidade_disponivel = $5, preco = $6, autor_id = $7
       WHERE id = $8
       RETURNING *`,
			[
				dados.titulo ?? atual.titulo,
				dados.isbn ?? atual.isbn,
				dados.anoPublicacao ?? atual.anoPublicacao,
				dados.quantidadeTotal ?? atual.quantidadeTotal,
				dados.quantidadeDisponivel ?? atual.quantidadeDisponivel,
				dados.preco ?? atual.preco,
				dados.autorId ?? atual.autorId,
				id,
			],
		);
		return mapLivroRowToModel(resultado.rows[0]);
	}

	public async remover(id: number): Promise<boolean> {
		const resultado = await pool.query(`DELETE FROM livros WHERE id = $1`, [
			id,
		]);
		return (resultado.rowCount ?? 0) > 0;
	}

	/** Ajusta a quantidade disponivel (usado nos empréstimos/devoluções). */
	public async ajustarQuantidadeDisponivel(
		id: number,
		delta: number,
	): Promise<void> {
		await pool.query(
			`UPDATE livros SET quantidade_disponivel = quantidade_disponivel + $1 WHERE id = $2`,
			[delta, id],
		);
	}

	/** Verifica se existem empréstimos (ativos ou não) vinculados a este livro. */
	public async possuiEmprestimosVinculados(id: number): Promise<boolean> {
		const resultado = await pool.query(
			`SELECT 1 FROM emprestimos WHERE livro_id = $1 LIMIT 1`,
			[id],
		);
		return resultado.rows.length > 0;
	}
}
