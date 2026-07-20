import pool from '../database/connection';
import { Emprestimo } from '../models/Emprestimo';
import {
	mapEmprestimoRowToModel,
	mapEmprestimoDetalhadoRowToModel,
	EmprestimoDetalhado,
} from '../utils/dataMappers';

export interface CriarEmprestimoDados {
	livroId: number;
	clienteId: number;
	dataDevolucaoPrevista?: Date | null;
}

export class EmprestimoRepository {
	public async criar(dados: CriarEmprestimoDados): Promise<Emprestimo> {
		const resultado = await pool.query(
			`INSERT INTO emprestimos (livro_id, cliente_id, data_devolucao_prevista)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[dados.livroId, dados.clienteId, dados.dataDevolucaoPrevista ?? null],
		);
		return mapEmprestimoRowToModel(resultado.rows[0]);
	}

	public async buscarPorId(id: number): Promise<Emprestimo | null> {
		const resultado = await pool.query(
			`SELECT * FROM emprestimos WHERE id = $1`,
			[id],
		);
		if (resultado.rows.length === 0) return null;
		return mapEmprestimoRowToModel(resultado.rows[0]);
	}

	/** Lista todos os emprestimos com dados do livro e do cliente unidos via JOIN (RF12, RF17). */
	public async listarTodosDetalhado(): Promise<EmprestimoDetalhado[]> {
		const resultado = await pool.query(
			`SELECT e.id, l.titulo AS livro_titulo, c.nome AS cliente_nome,
              e.data_emprestimo, e.data_devolucao_prevista, e.data_devolucao_real, e.status
       FROM emprestimos e
       INNER JOIN livros l ON l.id = e.livro_id
       INNER JOIN clientes c ON c.id = e.cliente_id
       ORDER BY e.data_emprestimo DESC`,
		);
		return resultado.rows.map(mapEmprestimoDetalhadoRowToModel);
	}

	public async marcarComoDevolvido(id: number): Promise<Emprestimo> {
		const resultado = await pool.query(
			`UPDATE emprestimos
       SET status = 'DEVOLVIDO', data_devolucao_real = NOW()
       WHERE id = $1
       RETURNING *`,
			[id],
		);
		return mapEmprestimoRowToModel(resultado.rows[0]);
	}
}
