import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log("Conexao com o PostgreSQL estabelecida com sucesso.");
    client.release();
  } catch (error) {
    console.error("Falha ao conectar ao PostgreSQL:", error);
    throw error;
  }
}

export default pool;