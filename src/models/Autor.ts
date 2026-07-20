export interface AutorProps {
	id?: number;
	nome: string;
	nacionalidade?: string | null;
	dataNascimento?: Date | null;
	criadoEm?: Date;
}

export class Autor {
	public id?: number;
	public nome: string;
	public nacionalidade?: string | null;
	public dataNascimento?: Date | null;
	public criadoEm?: Date;

	constructor(props: AutorProps) {
		this.id = props.id;
		this.nome = props.nome;
		this.nacionalidade = props.nacionalidade ?? null;
		this.dataNascimento = props.dataNascimento ?? null;
		this.criadoEm = props.criadoEm;
	}
}
