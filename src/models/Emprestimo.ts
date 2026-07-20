export enum StatusEmprestimo {
	ATIVO = 'ATIVO',
	DEVOLVIDO = 'DEVOLVIDO',
}

export interface EmprestimoProps {
	id?: number;
	livroId: number;
	clienteId: number;
	dataEmprestimo?: Date;
	dataDevolucaoPrevista?: Date | null;
	dataDevolucaoReal?: Date | null;
	status?: StatusEmprestimo;
}

export class Emprestimo {
	public id?: number;
	public livroId: number;
	public clienteId: number;
	public dataEmprestimo?: Date;
	public dataDevolucaoPrevista?: Date | null;
	public dataDevolucaoReal?: Date | null;
	public status: StatusEmprestimo;

	constructor(props: EmprestimoProps) {
		this.id = props.id;
		this.livroId = props.livroId;
		this.clienteId = props.clienteId;
		this.dataEmprestimo = props.dataEmprestimo;
		this.dataDevolucaoPrevista = props.dataDevolucaoPrevista ?? null;
		this.dataDevolucaoReal = props.dataDevolucaoReal ?? null;
		this.status = props.status ?? StatusEmprestimo.ATIVO;
	}

	public estaAtivo(): boolean {
		return this.status === StatusEmprestimo.ATIVO;
	}
}
