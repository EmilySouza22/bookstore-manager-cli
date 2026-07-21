import { selecionarOpcao } from '../utils/prompt';
import { menuAutores } from '../controllers/AutorController';
import { menuLivros } from '../controllers/LivroController';
import { menuClientes } from '../controllers/ClienteController';
import { menuEmprestimos } from '../controllers/EmprestimoController';
import { menuRelatorios } from '../controllers/RelatorioController';

enum OpcaoMenuPrincipal {
	AUTORES = 'AUTORES',
	LIVROS = 'LIVROS',
	CLIENTES = 'CLIENTES',
	EMPRESTIMOS = 'EMPRESTIMOS',
	RELATORIOS = 'RELATORIOS',
	SAIR = 'SAIR',
}

export async function iniciarMenuPrincipal(): Promise<void> {
	let continuarExecucao = true;

	while (continuarExecucao) {
		console.clear();
		console.log('=================================');
		console.log('   BookStore CLI');
		console.log('=================================\n');

		const opcaoEscolhida = await selecionarOpcao('Selecione uma opcao:', [
			{ name: 'Autores', value: OpcaoMenuPrincipal.AUTORES },
			{ name: 'Livros', value: OpcaoMenuPrincipal.LIVROS },
			{ name: 'Clientes', value: OpcaoMenuPrincipal.CLIENTES },
			{ name: 'Emprestimos', value: OpcaoMenuPrincipal.EMPRESTIMOS },
			{ name: 'Relatorios', value: OpcaoMenuPrincipal.RELATORIOS },
			{ name: 'Encerrar aplicacao', value: OpcaoMenuPrincipal.SAIR },
		]);

		switch (opcaoEscolhida) {
			case OpcaoMenuPrincipal.AUTORES:
				await menuAutores();
				break;
			case OpcaoMenuPrincipal.LIVROS:
				await menuLivros();
				break;
			case OpcaoMenuPrincipal.CLIENTES:
				await menuClientes();
				break;
			case OpcaoMenuPrincipal.EMPRESTIMOS:
				await menuEmprestimos();
				break;
			case OpcaoMenuPrincipal.RELATORIOS:
				await menuRelatorios();
				break;
			case OpcaoMenuPrincipal.SAIR:
				console.log('\nEncerrando a aplicacao. Ate logo!');
				continuarExecucao = false;
				break;
		}
	}
}
