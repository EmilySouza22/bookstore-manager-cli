import inquirer from 'inquirer';

export interface OpcaoMenu {
	name: string;
	value: string;
}

/**
 * Exibe uma lista de opcoes e retorna o value escolhido pelo usuario.
 */
export async function selecionarOpcao(
	mensagem: string,
	opcoes: OpcaoMenu[],
): Promise<string> {
	const resposta = await inquirer.prompt<{ opcao: string }>([
		{
			type: 'list',
			name: 'opcao',
			message: mensagem,
			choices: opcoes,
		},
	]);
	return resposta.opcao;
}

/**
 * Solicita um texto livre ao usuario.
 */
export async function perguntarTexto(
	mensagem: string,
	obrigatorio = true,
): Promise<string> {
	const resposta = await inquirer.prompt<{ valor: string }>([
		{
			type: 'input',
			name: 'valor',
			message: mensagem,
			validate: (input: string) => {
				if (obrigatorio && input.trim().length === 0) {
					return 'Este campo e obrigatorio.';
				}
				return true;
			},
		},
	]);
	return resposta.valor.trim();
}

/**
 * Solicita um numero ao usuario, com validacao basica.
 */
export async function perguntarNumero(
	mensagem: string,
	obrigatorio = true,
): Promise<number | null> {
	const resposta = await inquirer.prompt<{ valor: string }>([
		{
			type: 'input',
			name: 'valor',
			message: mensagem,
			validate: (input: string) => {
				if (!obrigatorio && input.trim().length === 0) return true;
				if (input.trim().length === 0) return 'Este campo e obrigatorio.';
				if (Number.isNaN(Number(input))) return 'Digite um numero valido.';
				return true;
			},
		},
	]);

	if (resposta.valor.trim().length === 0) return null;
	return Number(resposta.valor);
}

/**
 * Solicita confirmacao (sim/nao) ao usuario.
 */
export async function confirmar(mensagem: string): Promise<boolean> {
	const resposta = await inquirer.prompt<{ ok: boolean }>([
		{
			type: 'confirm',
			name: 'ok',
			message: mensagem,
			default: false,
		},
	]);
	return resposta.ok;
}

/**
 * Pausa a execucao ate o usuario pressionar Enter.
 * Util para o usuario poder ler uma mensagem antes do menu ser redesenhado.
 */
export async function pausar(
	mensagem = 'Pressione Enter para continuar...',
): Promise<void> {
	await inquirer.prompt([
		{
			type: 'input',
			name: 'continuar',
			message: mensagem,
		},
	]);
}
