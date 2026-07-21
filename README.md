# 📚 BookStore CLI

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![CLI](https://img.shields.io/badge/CLI-000000?style=for-the-badge&logo=windowsterminal&logoColor=white)

Aplicação de linha de comando (CLI) para gerenciamento de uma pequena livraria, desenvolvida como Projeto Final Avaliativo do Módulo 01 do curso Desenvolvedor(a) Back End Node.

## 📖 Descrição do Projeto

O **BookStore CLI** é um sistema de gerenciamento de livraria executado via terminal, que permite administrar autores, livros, clientes e empréstimos, utilizando o PostgreSQL como banco de dados relacional para persistência das informações. O sistema substitui o controle manual de uma livraria por uma aplicação organizada, com regras de negócio, validações e relatórios gerenciais.

## 🎯 Objetivo

Desenvolver uma aplicação CLI capaz de:

- Gerenciar autores, livros, clientes e empréstimos;
- Persistir informações em um banco de dados PostgreSQL;
- Aplicar regras de negócio durante as operações do sistema;
- Realizar consultas relacionais utilizando SQL (JOIN, GROUP BY, ORDER BY, LIMIT, funções de agregação);
- Gerar relatórios gerenciais a partir dos dados armazenados;
- Organizar o código em camadas, promovendo modularização e reutilização;
- Aplicar recursos de TypeScript, Programação Orientada a Objetos e programação assíncrona.

## 🛠️ Tecnologias Utilizadas

- **Node.js** — ambiente de execução
- **TypeScript** — tipagem estática
- **PostgreSQL** — banco de dados relacional
- **pg** — driver nativo de conexão com PostgreSQL (sem ORM)
- **inquirer** (v8.2.6) — menus interativos no terminal
- **dotenv** — variáveis de ambiente
- **tsx** — execução de TypeScript em desenvolvimento

## ✅ Requisitos para Execução

Antes de instalar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v14 ou superior)
- [Git](https://git-scm.com/)

## 🗄️ Configuração do Banco de Dados

1. Crie o banco de dados no PostgreSQL:

   ```sql
   CREATE DATABASE bookstore_db;
   ```

2. Execute o script de criação das tabelas localizado em `database/schema.sql`:

   ```bash
   psql -U <seu_usuario> -d bookstore_db -f database/schema.sql
   ```

   O script cria as tabelas `autores`, `livros`, `clientes` e `emprestimos`, com chaves primárias, chaves estrangeiras, constraints de integridade (`CHECK`, `ON DELETE RESTRICT`) e índices.

## ⚙️ Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/EmilySouza22/bookstore-cli
   cd bookstore-cli
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as credenciais de conexão do banco:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=<seu_usuario>
   DB_PASSWORD=<sua_senha>
   DB_NAME=bookstore_db
   ```

## ▶️ Execução

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

> ⚠️ O script `dev` executa `tsx src/main.ts` **sem** a flag `--watch`, pois ela interfere no _raw mode_ utilizado pelo `inquirer` para capturar as setas do teclado nos menus.

Para compilar e executar a versão de produção:

```bash
npm run build
npm start
```

## 🏗️ Arquitetura do Projeto

A aplicação segue uma arquitetura organizada em camadas, com separação de responsabilidades:

```
Usuário → Menu → Controller → Service → Repository → PostgreSQL
```

| Camada           | Responsabilidade                                                                        |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Main**         | Inicia a aplicação, conecta ao banco e inicia o menu principal                          |
| **Menus**        | Exibe as opções e recebe as escolhas do usuário                                         |
| **Controllers**  | Interage com o terminal, recebe entradas e aciona os Services                           |
| **Services**     | Implementa as regras de negócio e validações                                            |
| **Repositories** | Executa os comandos SQL de acesso ao PostgreSQL                                         |
| **Models**       | Representam as entidades do sistema (classes/interfaces)                                |
| **Database**     | Configuração da conexão e script SQL do banco                                           |
| **Utils**        | Funções auxiliares reutilizáveis (validações, mapeamento de dados, tratamento de erros) |

O tratamento de erros é centralizado em `src/utils/errors.ts`, com classes específicas (`AppError`, `ValidationError`, `NotFoundError`, `BusinessRuleError`) tratadas nos Controllers, garantindo que falhas não interrompam a execução da aplicação.

## 📦 Funcionalidades Implementadas

### Autores

- Cadastrar, listar, consultar por ID, atualizar e remover autores

### Livros

- Cadastrar, listar, consultar, atualizar e remover livros
- Vínculo obrigatório com um autor existente
- Bloqueio de remoção de livros com empréstimos vinculados

### Clientes

- Cadastrar, listar, consultar, atualizar e remover clientes
- Validação de e-mail e tratamento de duplicidade de e-mail/CPF

### Empréstimos

- Registro de empréstimo, com validação de existência de livro/cliente e disponibilidade
- Registro de devolução, com atualização automática da disponibilidade
- Consulta de empréstimos com dados de livro, cliente e data (via `JOIN`)

### Relatórios

- Livros disponíveis
- Livros emprestados
- Livros cadastrados por autor
- Quantidade de empréstimos por livro (`GROUP BY`, `LIMIT`)
- Clientes com empréstimos ativos

## 📁 Estrutura de Pastas

```
bookstore-cli/
├── database/
│   └── schema.sql
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── database/
│   ├── utils/
│   │   ├── errors.ts
│   │   └── dataMappers.ts
│   ├── menus/
│   └── main.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Exemplos de Utilização

Ao iniciar a aplicação com `npm run dev`, o menu principal é exibido:

```
? BookStore CLI — Selecione uma opção:
❯ Autores
  Livros
  Clientes
  Empréstimos
  Relatórios
  Encerrar aplicação
```

Exemplo de fluxo — cadastro de um livro:

```
? Selecione uma opção: Livros
? Selecione uma opção: Cadastrar livro
? Título: O Senhor dos Anéis
? Autor (ID): 1
? Quantidade disponível: 5
✔ Livro cadastrado com sucesso!
```

Exemplo de tratamento de erro — empréstimo de livro indisponível:

```
? Selecione uma opção: Empréstimos
? Selecione uma opção: Realizar empréstimo
? Livro (ID): 3
✖ Erro: livro indisponível para empréstimo no momento.
```

## 👤 Integrante

- **Emily Souza** — desenvolvimento individual do projeto

## 📋 Kanban

[![Kanban](https://img.shields.io/badge/GitHub%20Projects-Kanban-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/users/EmilySouza22/projects/3)

## 🎥 Vídeo de Apresentação

[![Vídeo](https://img.shields.io/badge/YouTube-Assistir-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](<LINK_DO_VIDEO>)
