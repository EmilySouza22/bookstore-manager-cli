import { ClienteService } from '../services/ClienteService';
import { AppError } from '../utils/errors';
import {
	selecionarOpcao,
	perguntarTexto,
	perguntarNumero,
	confirmar,
	pausar,
} from '../utils/prompt';

const clienteService = new ClienteService();

enum OpcaoCliente {
	CADASTRAR = 'CADASTRAR',
	LISTAR = 'LISTAR',
	CONSULTAR = 'CONSULTAR',
	ATUALIZAR = 'ATUALIZAR',
	REMOVER = 'REMOVER',
	VOLTAR = 'VOLTAR',
}

export async function menuClientes(): Promise<void> {
	let continuarNoModulo = true;

	while (continuarNoModulo) {
		console.log('\n--- Gerenciamento de Clientes ---');

		const opcao = await selecionarOpcao('O que deseja fazer?', [
			{ name: 'Cadastrar cliente', value: OpcaoCliente.CADASTRAR },
			{ name: 'Listar clientes', value: OpcaoCliente.LISTAR },
			{ name: 'Consultar cliente por id', value: OpcaoCliente.CONSULTAR },
			{ name: 'Atualizar cliente', value: OpcaoCliente.ATUALIZAR },
			{ name: 'Remover cliente', value: OpcaoCliente.REMOVER },
			{ name: 'Voltar ao menu principal', value: OpcaoCliente.VOLTAR },
		]);

		try {
			switch (opcao) {
				case OpcaoCliente.CADASTRAR:
					await cadastrarCliente();
					break;
				case OpcaoCliente.LISTAR:
					await listarClientes();
					break;
				case OpcaoCliente.CONSULTAR:
					await consultarCliente();
					break;
				case OpcaoCliente.ATUALIZAR:
					await atualizarCliente();
					break;
				case OpcaoCliente.REMOVER:
					await removerCliente();
					break;
				case OpcaoCliente.VOLTAR:
					continuarNoModulo = false;
					break;
			}
		} catch (error) {
			if (error instanceof AppError) {
				console.log(`\n[Aviso] ${error.message}`);
			} else {
				console.error('\n[Erro inesperado]', error);
			}
			if (opcao !== OpcaoCliente.VOLTAR) await pausar();
		}
	}
}

async function cadastrarCliente(): Promise<void> {
	const nome = await perguntarTexto('Nome do cliente:');
	const email = await perguntarTexto('Email do cliente:');
	const telefone = await perguntarTexto('Telefone (opcional):', false);
	const cpf = await perguntarTexto('CPF (opcional):', false);

	const cliente = await clienteService.cadastrar({
		nome,
		email,
		telefone: telefone || null,
		cpf: cpf || null,
	});

	console.log(`\nCliente cadastrado com sucesso! (id: ${cliente.id})`);
	await pausar();
}

async function listarClientes(): Promise<void> {
	const clientes = await clienteService.listarTodos();

	if (clientes.length === 0) {
		console.log('\nNenhum cliente cadastrado.');
	} else {
		console.log('\nID | Nome | Email | Telefone | CPF');
		clientes.forEach((cliente) => {
			console.log(
				`${cliente.id} | ${cliente.nome} | ${cliente.email} | ${cliente.telefone ?? '-'} | ${cliente.cpf ?? '-'}`,
			);
		});
	}
	await pausar();
}

async function consultarCliente(): Promise<void> {
	const id = await perguntarNumero('Digite o id do cliente:');
	const cliente = await clienteService.buscarPorId(id as number);

	console.log('\nDados do cliente:');
	console.log(`ID: ${cliente.id}`);
	console.log(`Nome: ${cliente.nome}`);
	console.log(`Email: ${cliente.email}`);
	console.log(`Telefone: ${cliente.telefone ?? '-'}`);
	console.log(`CPF: ${cliente.cpf ?? '-'}`);
	await pausar();
}

async function atualizarCliente(): Promise<void> {
	const id = await perguntarNumero('Digite o id do cliente a atualizar:');
	await clienteService.buscarPorId(id as number);

	console.log('Deixe em branco para manter o valor atual.');
	const nome = await perguntarTexto('Novo nome:', false);
	const email = await perguntarTexto('Novo email:', false);
	const telefone = await perguntarTexto('Novo telefone:', false);
	const cpf = await perguntarTexto('Novo CPF:', false);

	const clienteAtualizado = await clienteService.atualizar(id as number, {
		nome: nome || undefined,
		email: email || undefined,
		telefone: telefone || undefined,
		cpf: cpf || undefined,
	});

	console.log(
		`\nCliente atualizado com sucesso! (id: ${clienteAtualizado.id})`,
	);
	await pausar();
}

async function removerCliente(): Promise<void> {
	const id = await perguntarNumero('Digite o id do cliente a remover:');
	const cliente = await clienteService.buscarPorId(id as number);

	const confirmado = await confirmar(
		`Tem certeza que deseja remover o cliente "${cliente.nome}"?`,
	);
	if (!confirmado) {
		console.log('\nOperacao cancelada.');
		await pausar();
		return;
	}

	await clienteService.remover(id as number);
	console.log('\nCliente removido com sucesso!');
	await pausar();
}
