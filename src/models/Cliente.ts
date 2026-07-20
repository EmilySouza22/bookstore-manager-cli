export interface ClienteProps {
	id?: number;
	nome: string;
	email: string;
	telefone?: string | null;
	cpf?: string | null;
	criadoEm?: Date;
}

export class Cliente {
	public id?: number;
	public nome: string;
	public email: string;
	public telefone?: string | null;
	public cpf?: string | null;
	public criadoEm?: Date;

	constructor(props: ClienteProps) {
		this.id = props.id;
		this.nome = props.nome;
		this.email = props.email;
		this.telefone = props.telefone ?? null;
		this.cpf = props.cpf ?? null;
		this.criadoEm = props.criadoEm;
	}
}
