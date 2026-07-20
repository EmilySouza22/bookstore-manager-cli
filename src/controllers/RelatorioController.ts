import { RelatorioService } from '../services/RelatorioService';
import { AppError } from '../utils/errors';
import { selecionarOpcao, pausar } from '../utils/prompt';

const relatorioService = new RelatorioService();

enum OpcaoRelatorio {
	LIVROS_DISPONIVEIS = 'LIVROS_DISPONIVEIS',
	LIVROS_EMPRESTADOS = 'LIVROS_EMPRESTADOS',
	LIVROS_POR_AUTOR = 'LIVROS_POR_AUTOR',
	EMPRESTIMOS_POR_LIVRO = 'EMPRESTIMOS_POR_LIVRO',
	CLIENTES_ATIVOS = 'CLIENTES_ATIVOS',
	VOLTAR = 'VOLTAR',
}

export async function menuRelatorios(): Promise<void> {
	let continuarNoModulo = true;

	while (continuarNoModulo) {
		console.log('\n--- Relatorios ---');

		const opcao = await selecionarOpcao('Selecione um relatorio:', [
			{ name: 'Livros disponiveis', value: OpcaoRelatorio.LIVROS_DISPONIVEIS },
			{
				name: 'Livros emprestados',
				value: OpcaoRelatorio.LIVROS_EMPRESTADOS,
			},
			{
				name: 'Livros cadastrados por autor',
				value: OpcaoRelatorio.LIVROS_POR_AUTOR,
			},
			{
				name: 'Quantidade de emprestimos por livro',
				value: OpcaoRelatorio.EMPRESTIMOS_POR_LIVRO,
			},
			{
				name: 'Clientes com emprestimos ativos',
				value: OpcaoRelatorio.CLIENTES_ATIVOS,
			},
			{ name: 'Voltar ao menu principal', value: OpcaoRelatorio.VOLTAR },
		]);

		try {
			switch (opcao) {
				case OpcaoRelatorio.LIVROS_DISPONIVEIS:
					await exibirLivrosDisponiveis();
					break;
				case OpcaoRelatorio.LIVROS_EMPRESTADOS:
					await exibirLivrosEmprestados();
					break;
				case OpcaoRelatorio.LIVROS_POR_AUTOR:
					await exibirLivrosPorAutor();
					break;
				case OpcaoRelatorio.EMPRESTIMOS_POR_LIVRO:
					await exibirEmprestimosPorLivro();
					break;
				case OpcaoRelatorio.CLIENTES_ATIVOS:
					await exibirClientesComEmprestimosAtivos();
					break;
				case OpcaoRelatorio.VOLTAR:
					continuarNoModulo = false;
					break;
			}
		} catch (error) {
			if (error instanceof AppError) {
				console.log(`\n[Aviso] ${error.message}`);
			} else {
				console.error('\n[Erro inesperado]', error);
			}
			if (opcao !== OpcaoRelatorio.VOLTAR) await pausar();
		}
	}
}

async function exibirLivrosDisponiveis(): Promise<void> {
	const livros = await relatorioService.livrosDisponiveis();
	console.log('\n--- Livros Disponiveis ---');
	if (livros.length === 0) {
		console.log('Nenhum livro disponivel no momento.');
	} else {
		console.log('ID | Titulo | Disponivel/Total');
		livros.forEach((l) =>
			console.log(
				`${l.id} | ${l.titulo} | ${l.quantidadeDisponivel}/${l.quantidadeTotal}`,
			),
		);
	}
	await pausar();
}

async function exibirLivrosEmprestados(): Promise<void> {
	const livros = await relatorioService.livrosEmprestados();
	console.log('\n--- Livros Emprestados ---');
	if (livros.length === 0) {
		console.log('Nenhum livro emprestado no momento.');
	} else {
		console.log('ID | Titulo | Cliente | Data do emprestimo');
		livros.forEach((l) =>
			console.log(
				`${l.id} | ${l.titulo} | ${l.clienteNome} | ${new Date(
					l.dataEmprestimo,
				).toLocaleDateString('pt-BR')}`,
			),
		);
	}
	await pausar();
}

async function exibirLivrosPorAutor(): Promise<void> {
	const dados = await relatorioService.livrosPorAutor();
	console.log('\n--- Livros Cadastrados por Autor ---');
	if (dados.length === 0) {
		console.log('Nenhum autor cadastrado.');
	} else {
		console.log('Autor | Quantidade de livros');
		dados.forEach((d) => console.log(`${d.autorNome} | ${d.quantidadeLivros}`));
	}
	await pausar();
}

async function exibirEmprestimosPorLivro(): Promise<void> {
	const dados = await relatorioService.emprestimosPorLivro();
	console.log('\n--- Emprestimos por Livro (top 10) ---');
	if (dados.length === 0) {
		console.log('Nenhum emprestimo registrado.');
	} else {
		console.log('Livro | Total de emprestimos');
		dados.forEach((d) =>
			console.log(`${d.livroTitulo} | ${d.totalEmprestimos}`),
		);
	}
	await pausar();
}

async function exibirClientesComEmprestimosAtivos(): Promise<void> {
	const dados = await relatorioService.clientesComEmprestimosAtivos();
	console.log('\n--- Clientes com Emprestimos Ativos ---');
	if (dados.length === 0) {
		console.log('Nenhum cliente com emprestimo ativo.');
	} else {
		console.log('ID | Nome | Email | Emprestimos ativos');
		dados.forEach((d) =>
			console.log(
				`${d.id} | ${d.nome} | ${d.email} | ${d.quantidadeEmprestimosAtivos}`,
			),
		);
	}
	await pausar();
}
