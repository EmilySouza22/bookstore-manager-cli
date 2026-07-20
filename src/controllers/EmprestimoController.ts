import { EmprestimoService } from '../services/EmprestimoService';
import { AppError } from '../utils/errors';
import {
	selecionarOpcao,
	perguntarTexto,
	perguntarNumero,
	pausar,
} from '../utils/prompt';

const emprestimoService = new EmprestimoService();

enum OpcaoEmprestimo {
	REALIZAR = 'REALIZAR',
	DEVOLVER = 'DEVOLVER',
	CONSULTAR = 'CONSULTAR',
	VOLTAR = 'VOLTAR',
}

export async function menuEmprestimos(): Promise<void> {
	let continuarNoModulo = true;

	while (continuarNoModulo) {
		console.log('\n--- Gerenciamento de Emprestimos ---');

		const opcao = await selecionarOpcao('O que deseja fazer?', [
			{ name: 'Realizar emprestimo', value: OpcaoEmprestimo.REALIZAR },
			{ name: 'Registrar devolucao', value: OpcaoEmprestimo.DEVOLVER },
			{ name: 'Consultar emprestimos', value: OpcaoEmprestimo.CONSULTAR },
			{ name: 'Voltar ao menu principal', value: OpcaoEmprestimo.VOLTAR },
		]);

		try {
			switch (opcao) {
				case OpcaoEmprestimo.REALIZAR:
					await realizarEmprestimo();
					break;
				case OpcaoEmprestimo.DEVOLVER:
					await registrarDevolucao();
					break;
				case OpcaoEmprestimo.CONSULTAR:
					await consultarEmprestimos();
					break;
				case OpcaoEmprestimo.VOLTAR:
					continuarNoModulo = false;
					break;
			}
		} catch (error) {
			if (error instanceof AppError) {
				console.log(`\n[Aviso] ${error.message}`);
			} else {
				console.error('\n[Erro inesperado]', error);
			}
			if (opcao !== OpcaoEmprestimo.VOLTAR) await pausar();
		}
	}
}

async function realizarEmprestimo(): Promise<void> {
	const livroId = await perguntarNumero('Id do livro a emprestar:');
	const clienteId = await perguntarNumero('Id do cliente:');
	const dataDevolucaoTexto = await perguntarTexto(
		'Data prevista de devolucao (AAAA-MM-DD, opcional):',
		false,
	);

	const emprestimo = await emprestimoService.realizarEmprestimo(
		livroId as number,
		clienteId as number,
		dataDevolucaoTexto ? new Date(dataDevolucaoTexto) : null,
	);

	console.log(`\nEmprestimo realizado com sucesso! (id: ${emprestimo.id})`);
	await pausar();
}

async function registrarDevolucao(): Promise<void> {
	const emprestimoId = await perguntarNumero('Id do emprestimo a devolver:');

	await emprestimoService.registrarDevolucao(emprestimoId as number);

	console.log('\nDevolucao registrada com sucesso!');
	await pausar();
}

async function consultarEmprestimos(): Promise<void> {
	const emprestimos = await emprestimoService.listarTodosDetalhado();

	if (emprestimos.length === 0) {
		console.log('\nNenhum emprestimo registrado.');
	} else {
		console.log(
			'\nID | Livro | Cliente | Data emprestimo | Devolucao prevista | Status',
		);
		emprestimos.forEach((emp) => {
			const data = new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR');
			const previsao = emp.dataDevolucaoPrevista
				? new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')
				: '-';
			console.log(
				`${emp.id} | ${emp.livroTitulo} | ${emp.clienteNome} | ${data} | ${previsao} | ${emp.status}`,
			);
		});
	}
	await pausar();
}
