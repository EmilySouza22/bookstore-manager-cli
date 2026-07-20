import pool from '../database/connection';
import { Autor, AutorProps } from '../models/Autor';
import { mapAutorRowToModel } from '../utils/dataMappers';

export class AutorRepository {
	public async criar(dados: AutorProps): Promise<Autor> {
		const resultado = await pool.query(
			`INSERT INTO autores (nome, nacionalidade, data_nascimento)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[dados.nome, dados.nacionalidade ?? null, dados.dataNascimento ?? null],
		);
		return mapAutorRowToModel(resultado.rows[0]);
	}

	public async listarTodos(): Promise<Autor[]> {
		const resultado = await pool.query(
			`SELECT * FROM autores ORDER BY nome ASC`,
		);
		return resultado.rows.map(mapAutorRowToModel);
	}

	public async buscarPorId(id: number): Promise<Autor | null> {
		const resultado = await pool.query(`SELECT * FROM autores WHERE id = $1`, [
			id,
		]);
		if (resultado.rows.length === 0) return null;
		return mapAutorRowToModel(resultado.rows[0]);
	}

	public async atualizar(
		id: number,
		dados: Partial<AutorProps>,
	): Promise<Autor | null> {
		const atual = await this.buscarPorId(id);
		if (!atual) return null;

		const resultado = await pool.query(
			`UPDATE autores
       SET nome = $1, nacionalidade = $2, data_nascimento = $3
       WHERE id = $4
       RETURNING *`,
			[
				dados.nome ?? atual.nome,
				dados.nacionalidade ?? atual.nacionalidade,
				dados.dataNascimento ?? atual.dataNascimento,
				id,
			],
		);
		return mapAutorRowToModel(resultado.rows[0]);
	}

	public async remover(id: number): Promise<boolean> {
		const resultado = await pool.query(`DELETE FROM autores WHERE id = $1`, [
			id,
		]);
		return (resultado.rowCount ?? 0) > 0;
	}

	/** Verifica se existem livros cadastrados vinculados a este autor. */
	public async possuiLivrosVinculados(id: number): Promise<boolean> {
		const resultado = await pool.query(
			`SELECT 1 FROM livros WHERE autor_id = $1 LIMIT 1`,
			[id],
		);
		return resultado.rows.length > 0;
	}
}
