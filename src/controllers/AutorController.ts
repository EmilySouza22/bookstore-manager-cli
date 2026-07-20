import { AutorService } from '../services/AutorService';
import { AppError } from '../utils/errors';
import {
	selecionarOpcao,
	perguntarTexto,
	perguntarNumero,
	confirmar,
	pausar,
} from '../utils/prompt';

const autorService = new AutorService();

enum OpcaoAutor {
	CADASTRAR = 'CADASTRAR',
	LISTAR = 'LISTAR',
	CONSULTAR = 'CONSULTAR',
	ATUALIZAR = 'ATUALIZAR',
	REMOVER = 'REMOVER',
	VOLTAR = 'VOLTAR',
}

export async function menuAutores(): Promise<void> {
	let continuarNoModulo = true;

	while (continuarNoModulo) {
		console.log('\n--- Gerenciamento de Autores ---');

		const opcao = await selecionarOpcao('O que deseja fazer?', [
			{ name: 'Cadastrar autor', value: OpcaoAutor.CADASTRAR },
			{ name: 'Listar autores', value: OpcaoAutor.LISTAR },
			{ name: 'Consultar autor por id', value: OpcaoAutor.CONSULTAR },
			{ name: 'Atualizar autor', value: OpcaoAutor.ATUALIZAR },
			{ name: 'Remover autor', value: OpcaoAutor.REMOVER },
			{ name: 'Voltar ao menu principal', value: OpcaoAutor.VOLTAR },
		]);

		try {
			switch (opcao) {
				case OpcaoAutor.CADASTRAR:
					await cadastrarAutor();
					break;
				case OpcaoAutor.LISTAR:
					await listarAutores();
					break;
				case OpcaoAutor.CONSULTAR:
					await consultarAutor();
					break;
				case OpcaoAutor.ATUALIZAR:
					await atualizarAutor();
					break;
				case OpcaoAutor.REMOVER:
					await removerAutor();
					break;
				case OpcaoAutor.VOLTAR:
					continuarNoModulo = false;
					break;
			}
		} catch (error) {
			if (error instanceof AppError) {
				console.log(`\n[Aviso] ${error.message}`);
			} else {
				console.error('\n[Erro inesperado]', error);
			}
			if (opcao !== OpcaoAutor.VOLTAR) await pausar();
		}
	}
}

async function cadastrarAutor(): Promise<void> {
	const nome = await perguntarTexto('Nome do autor:');
	const nacionalidade = await perguntarTexto(
		'Nacionalidade (opcional):',
		false,
	);
	const dataNascimentoTexto = await perguntarTexto(
		'Data de nascimento (AAAA-MM-DD, opcional):',
		false,
	);

	const autor = await autorService.cadastrar({
		nome,
		nacionalidade: nacionalidade || null,
		dataNascimento: dataNascimentoTexto ? new Date(dataNascimentoTexto) : null,
	});

	console.log(`\nAutor cadastrado com sucesso! (id: ${autor.id})`);
	await pausar();
}

async function listarAutores(): Promise<void> {
	const autores = await autorService.listarTodos();

	if (autores.length === 0) {
		console.log('\nNenhum autor cadastrado.');
	} else {
		console.log('\nID | Nome | Nacionalidade | Data de nascimento');
		autores.forEach((autor) => {
			const data = autor.dataNascimento
				? new Date(autor.dataNascimento).toLocaleDateString('pt-BR')
				: '-';
			console.log(
				`${autor.id} | ${autor.nome} | ${autor.nacionalidade ?? '-'} | ${data}`,
			);
		});
	}
	await pausar();
}

async function consultarAutor(): Promise<void> {
	const id = await perguntarNumero('Digite o id do autor:');
	const autor = await autorService.buscarPorId(id as number);

	console.log('\nDados do autor:');
	console.log(`ID: ${autor.id}`);
	console.log(`Nome: ${autor.nome}`);
	console.log(`Nacionalidade: ${autor.nacionalidade ?? '-'}`);
	console.log(
		`Data de nascimento: ${
			autor.dataNascimento
				? new Date(autor.dataNascimento).toLocaleDateString('pt-BR')
				: '-'
		}`,
	);
	await pausar();
}

async function atualizarAutor(): Promise<void> {
	const id = await perguntarNumero('Digite o id do autor a atualizar:');
	await autorService.buscarPorId(id as number); // valida existencia antes de perguntar os novos dados

	console.log('Deixe em branco para manter o valor atual.');
	const nome = await perguntarTexto('Novo nome:', false);
	const nacionalidade = await perguntarTexto('Nova nacionalidade:', false);
	const dataNascimentoTexto = await perguntarTexto(
		'Nova data de nascimento (AAAA-MM-DD):',
		false,
	);

	const autorAtualizado = await autorService.atualizar(id as number, {
		nome: nome || undefined,
		nacionalidade: nacionalidade || undefined,
		dataNascimento: dataNascimentoTexto
			? new Date(dataNascimentoTexto)
			: undefined,
	});

	console.log(`\nAutor atualizado com sucesso! (id: ${autorAtualizado.id})`);
	await pausar();
}

async function removerAutor(): Promise<void> {
	const id = await perguntarNumero('Digite o id do autor a remover:');
	const autor = await autorService.buscarPorId(id as number);

	const confirmado = await confirmar(
		`Tem certeza que deseja remover o autor "${autor.nome}"?`,
	);
	if (!confirmado) {
		console.log('\nOperacao cancelada.');
		await pausar();
		return;
	}

	await autorService.remover(id as number);
	console.log('\nAutor removido com sucesso!');
	await pausar();
}
