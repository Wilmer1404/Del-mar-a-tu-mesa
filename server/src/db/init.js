const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../config');

async function init() {
  const pool = new Pool({
    host:     config.db.host,
    port:     config.db.port,
    database: config.db.database,
    user:     config.db.user,
    password: config.db.password,
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
