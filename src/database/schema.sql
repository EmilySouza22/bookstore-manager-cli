-- =========================================================
-- BookStore Manager CLI - Script de criacao do banco de dados
-- =========================================================
-- Execute este script conectado ao banco "bookstore_db"
-- (crie o banco antes com: CREATE DATABASE bookstore_db;)
-- =========================================================

-- Remove as tabelas caso ja existam (permite reexecutar o script)
DROP TABLE IF EXISTS emprestimos;
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS autores;

-- =========================================================
-- Tabela: autores
-- =========================================================
CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(80),
    data_nascimento DATE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: livros
-- =========================================================
CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao INTEGER,
    quantidade_total INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_total >= 0),
    quantidade_disponivel INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_disponivel >= 0),
    preco NUMERIC(10, 2),
    autor_id INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_disponivel_menor_igual_total CHECK (quantidade_disponivel <= quantidade_total)
);

-- =========================================================
-- Tabela: clientes
-- =========================================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: emprestimos
-- =========================================================
CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    data_emprestimo TIMESTAMP NOT NULL DEFAULT NOW(),
    data_devolucao_prevista DATE,
    data_devolucao_real TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'DEVOLVIDO'))
);

-- =========================================================
-- Indices para otimizar consultas e relatorios
-- =========================================================
CREATE INDEX idx_livros_autor_id ON livros(autor_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos(cliente_id);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);