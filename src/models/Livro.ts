export interface LivroProps {
	id?: number;
	titulo: string;
	isbn?: string | null;
	anoPublicacao?: number | null;
	quantidadeTotal: number;
	quantidadeDisponivel: number;
	preco?: number | null;
	autorId: number;
	criadoEm?: Date;
}

export class Livro {
	public id?: number;
	public titulo: string;
	public isbn?: string | null;
	public anoPublicacao?: number | null;
	public quantidadeTotal: number;
	public quantidadeDisponivel: number;
	public preco?: number | null;
	public autorId: number;
	public criadoEm?: Date;

	constructor(props: LivroProps) {
		this.id = props.id;
		this.titulo = props.titulo;
		this.isbn = props.isbn ?? null;
		this.anoPublicacao = props.anoPublicacao ?? null;
		this.quantidadeTotal = props.quantidadeTotal;
		this.quantidadeDisponivel = props.quantidadeDisponivel;
		this.preco = props.preco ?? null;
		this.autorId = props.autorId;
		this.criadoEm = props.criadoEm;
	}

	public estaDisponivel(): boolean {
		return this.quantidadeDisponivel > 0;
	}
}
