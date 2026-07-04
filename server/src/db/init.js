/**
 * Inicializa la base de datos: ejecuta schema.sql sobre PostgreSQL.
 * Uso: node src/db/init.js
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function init() {
  const pool = new Pool({
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'delmar_a_tumesa',
    user:     process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  try {
    console.log('[DB] Ejecutando schema.sql...');
    await pool.query(sql);
    console.log('[DB] Schema creado exitosamente.');
  } catch (err) {
    console.error('[DB] Error al inicializar:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
