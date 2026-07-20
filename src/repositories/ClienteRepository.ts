import pool from '../database/connection';
import { Cliente, ClienteProps } from '../models/Cliente';
import { mapClienteRowToModel } from '../utils/dataMappers';

export class ClienteRepository {
	public async criar(dados: ClienteProps): Promise<Cliente> {
		const resultado = await pool.query(
			`INSERT INTO clientes (nome, email, telefone, cpf)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
			[dados.nome, dados.email, dados.telefone ?? null, dados.cpf ?? null],
		);
		return mapClienteRowToModel(resultado.rows[0]);
	}

	public async listarTodos(): Promise<Cliente[]> {
		const resultado = await pool.query(
			`SELECT * FROM clientes ORDER BY nome ASC`,
		);
		return resultado.rows.map(mapClienteRowToModel);
	}

	public async buscarPorId(id: number): Promise<Cliente | null> {
		const resultado = await pool.query(`SELECT * FROM clientes WHERE id = $1`, [
			id,
		]);
		if (resultado.rows.length === 0) return null;
		return mapClienteRowToModel(resultado.rows[0]);
	}

	public async atualizar(
		id: number,
		dados: Partial<ClienteProps>,
	): Promise<Cliente | null> {
		const atual = await this.buscarPorId(id);
		if (!atual) return null;

		const resultado = await pool.query(
			`UPDATE clientes
       SET nome = $1, email = $2, telefone = $3, cpf = $4
       WHERE id = $5
       RETURNING *`,
			[
				dados.nome ?? atual.nome,
				dados.email ?? atual.email,
				dados.telefone ?? atual.telefone,
				dados.cpf ?? atual.cpf,
				id,
			],
		);
		return mapClienteRowToModel(resultado.rows[0]);
	}

	public async remover(id: number): Promise<boolean> {
		const resultado = await pool.query(`DELETE FROM clientes WHERE id = $1`, [
			id,
		]);
		return (resultado.rowCount ?? 0) > 0;
	}

	/** Verifica se existem empréstimos (ativos ou não) vinculados a este cliente. */
	public async possuiEmprestimosVinculados(id: number): Promise<boolean> {
		const resultado = await pool.query(
			`SELECT 1 FROM emprestimos WHERE cliente_id = $1 LIMIT 1`,
			[id],
		);
		return resultado.rows.length > 0;
	}
}
