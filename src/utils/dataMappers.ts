import { Autor } from '../models/Autor';
import { Livro } from '../models/Livro';
import { Cliente } from '../models/Cliente';
import { Emprestimo, StatusEmprestimo } from '../models/Emprestimo';

/** Converte uma linha da tabela "autores" (snake_case) para o model Autor. */
export function mapAutorRowToModel(row: any): Autor {
	return new Autor({
		id: row.id,
		nome: row.nome,
		nacionalidade: row.nacionalidade,
		dataNascimento: row.data_nascimento,
		criadoEm: row.criado_em,
	});
}

/** Converte uma linha da tabela "livros" (snake_case) para o model Livro. */
export function mapLivroRowToModel(row: any): Livro {
	return new Livro({
		id: row.id,
		titulo: row.titulo,
		isbn: row.isbn,
		anoPublicacao: row.ano_publicacao,
		quantidadeTotal: row.quantidade_total,
		quantidadeDisponivel: row.quantidade_disponivel,
		preco: row.preco !== null ? Number(row.preco) : null,
		autorId: row.autor_id,
		criadoEm: row.criado_em,
	});
}

/** Converte uma linha da tabela "clientes" (snake_case) para o model Cliente. */
export function mapClienteRowToModel(row: any): Cliente {
	return new Cliente({
		id: row.id,
		nome: row.nome,
		email: row.email,
		telefone: row.telefone,
		cpf: row.cpf,
		criadoEm: row.criado_em,
	});
}

/** Converte uma linha da tabela "emprestimos" (snake_case) para o model Emprestimo. */
export function mapEmprestimoRowToModel(row: any): Emprestimo {
	return new Emprestimo({
		id: row.id,
		livroId: row.livro_id,
		clienteId: row.cliente_id,
		dataEmprestimo: row.data_emprestimo,
		dataDevolucaoPrevista: row.data_devolucao_prevista,
		dataDevolucaoReal: row.data_devolucao_real,
		status: row.status as StatusEmprestimo,
	});
}

/** Representa um emprestimo com dados do livro e do cliente ja unidos (JOIN), para relatorios e consultas (RF12). */
export interface EmprestimoDetalhado {
	id: number;
	livroTitulo: string;
	clienteNome: string;
	dataEmprestimo: Date;
	dataDevolucaoPrevista: Date | null;
	dataDevolucaoReal: Date | null;
	status: StatusEmprestimo;
}

export function mapEmprestimoDetalhadoRowToModel(
	row: any,
): EmprestimoDetalhado {
	return {
		id: row.id,
		livroTitulo: row.livro_titulo,
		clienteNome: row.cliente_nome,
		dataEmprestimo: row.data_emprestimo,
		dataDevolucaoPrevista: row.data_devolucao_prevista,
		dataDevolucaoReal: row.data_devolucao_real,
		status: row.status as StatusEmprestimo,
	};
}
