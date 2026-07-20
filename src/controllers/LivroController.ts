import { LivroService } from '../services/LivroService';
import { AppError } from '../utils/errors';
import {
	selecionarOpcao,
	perguntarTexto,
	perguntarNumero,
	confirmar,
	pausar,
} from '../utils/prompt';

const livroService = new LivroService();

enum OpcaoLivro {
	CADASTRAR = 'CADASTRAR',
	LISTAR = 'LISTAR',
	CONSULTAR = 'CONSULTAR',
	ATUALIZAR = 'ATUALIZAR',
	REMOVER = 'REMOVER',
	VOLTAR = 'VOLTAR',
}

export async function menuLivros(): Promise<void> {
	let continuarNoModulo = true;

	while (continuarNoModulo) {
		console.log('\n--- Gerenciamento de Livros ---');

		const opcao = await selecionarOpcao('O que deseja fazer?', [
			{ name: 'Cadastrar livro', value: OpcaoLivro.CADASTRAR },
			{ name: 'Listar livros', value: OpcaoLivro.LISTAR },
			{ name: 'Consultar livro por id', value: OpcaoLivro.CONSULTAR },
			{ name: 'Atualizar livro', value: OpcaoLivro.ATUALIZAR },
			{ name: 'Remover livro', value: OpcaoLivro.REMOVER },
			{ name: 'Voltar ao menu principal', value: OpcaoLivro.VOLTAR },
		]);

		try {
			switch (opcao) {
				case OpcaoLivro.CADASTRAR:
					await cadastrarLivro();
					break;
				case OpcaoLivro.LISTAR:
					await listarLivros();
					break;
				case OpcaoLivro.CONSULTAR:
					await consultarLivro();
					break;
				case OpcaoLivro.ATUALIZAR:
					await atualizarLivro();
					break;
				case OpcaoLivro.REMOVER:
					await removerLivro();
					break;
				case OpcaoLivro.VOLTAR:
					continuarNoModulo = false;
					break;
			}
		} catch (error) {
			if (error instanceof AppError) {
				console.log(`\n[Aviso] ${error.message}`);
			} else {
				console.error('\n[Erro inesperado]', error);
			}
			if (opcao !== OpcaoLivro.VOLTAR) await pausar();
		}
	}
}

async function cadastrarLivro(): Promise<void> {
	const titulo = await perguntarTexto('Titulo do livro:');
	const isbn = await perguntarTexto('ISBN (opcional):', false);
	const anoPublicacao = await perguntarNumero(
		'Ano de publicacao (opcional):',
		false,
	);
	const quantidadeTotal = await perguntarNumero(
		'Quantidade total de exemplares:',
	);
	const preco = await perguntarNumero('Preco (opcional):', false);
	const autorId = await perguntarNumero('Id do autor:');

	const livro = await livroService.cadastrar({
		titulo,
		isbn: isbn || null,
		anoPublicacao: anoPublicacao,
		quantidadeTotal: quantidadeTotal as number,
		quantidadeDisponivel: quantidadeTotal as number,
		preco: preco,
		autorId: autorId as number,
	});

	console.log(`\nLivro cadastrado com sucesso! (id: ${livro.id})`);
	await pausar();
}

async function listarLivros(): Promise<void> {
	const livros = await livroService.listarTodos();

	if (livros.length === 0) {
		console.log('\nNenhum livro cadastrado.');
	} else {
		console.log('\nID | Titulo | ISBN | Disponivel/Total | Autor(id) | Preco');
		livros.forEach((livro) => {
			console.log(
				`${livro.id} | ${livro.titulo} | ${livro.isbn ?? '-'} | ${livro.quantidadeDisponivel}/${livro.quantidadeTotal} | ${livro.autorId} | ${
					livro.preco !== null && livro.preco !== undefined
						? livro.preco.toFixed(2)
						: '-'
				}`,
			);
		});
	}
	await pausar();
}

async function consultarLivro(): Promise<void> {
	const id = await perguntarNumero('Digite o id do livro:');
	const livro = await livroService.buscarPorId(id as number);

	console.log('\nDados do livro:');
	console.log(`ID: ${livro.id}`);
	console.log(`Titulo: ${livro.titulo}`);
	console.log(`ISBN: ${livro.isbn ?? '-'}`);
	console.log(`Ano de publicacao: ${livro.anoPublicacao ?? '-'}`);
	console.log(`Quantidade total: ${livro.quantidadeTotal}`);
	console.log(`Quantidade disponivel: ${livro.quantidadeDisponivel}`);
	console.log(`Preco: ${livro.preco ?? '-'}`);
	console.log(`Autor (id): ${livro.autorId}`);
	await pausar();
}

async function atualizarLivro(): Promise<void> {
	const id = await perguntarNumero('Digite o id do livro a atualizar:');
	await livroService.buscarPorId(id as number);

	console.log('Deixe em branco para manter o valor atual.');
	const titulo = await perguntarTexto('Novo titulo:', false);
	const isbn = await perguntarTexto('Novo ISBN:', false);
	const anoPublicacao = await perguntarNumero('Novo ano de publicacao:', false);
	const quantidadeTotal = await perguntarNumero(
		'Nova quantidade total:',
		false,
	);
	const preco = await perguntarNumero('Novo preco:', false);
	const autorId = await perguntarNumero('Novo id do autor:', false);

	const livroAtualizado = await livroService.atualizar(id as number, {
		titulo: titulo || undefined,
		isbn: isbn || undefined,
		anoPublicacao: anoPublicacao ?? undefined,
		quantidadeTotal: quantidadeTotal ?? undefined,
		preco: preco ?? undefined,
		autorId: autorId ?? undefined,
	});

	console.log(`\nLivro atualizado com sucesso! (id: ${livroAtualizado.id})`);
	await pausar();
}

async function removerLivro(): Promise<void> {
	const id = await perguntarNumero('Digite o id do livro a remover:');
	const livro = await livroService.buscarPorId(id as number);

	const confirmado = await confirmar(
		`Tem certeza que deseja remover o livro "${livro.titulo}"?`,
	);
	if (!confirmado) {
		console.log('\nOperacao cancelada.');
		await pausar();
		return;
	}

	await livroService.remover(id as number);
	console.log('\nLivro removido com sucesso!');
	await pausar();
}
