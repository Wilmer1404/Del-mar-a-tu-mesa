-- ============================================================
-- DEL MAR A TU MESA — PostgreSQL Schema
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE rol_usuario      AS ENUM ('pescador', 'comprador');
CREATE TYPE metodo_pesca     AS ENUM ('artesanal_espinel', 'artesanal_red', 'palangre', 'buceo', 'trampa');
CREATE TYPE estado_captura   AS ENUM ('publicado', 'pendiente', 'en_revision', 'vendido', 'expirado');
CREATE TYPE estado_oferta    AS ENUM ('publicado', 'pendiente', 'vendido', 'expirado', 'revision');
CREATE TYPE estado_orden     AS ENUM ('pendiente', 'entregado', 'en_camino', 'cancelado');
CREATE TYPE estado_lote      AS ENUM ('certificado', 'verificado', 'pendiente', 'expirado');
CREATE TYPE estado_caleta    AS ENUM ('abierto', 'alerta', 'cerrado');
CREATE TYPE tendencia_precio AS ENUM ('up', 'down');
CREATE TYPE categoria_producto AS ENUM ('peces', 'crustaceos', 'cefalopodos');
CREATE TYPE tipo_orden       AS ENUM ('producto_pesca', 'insumo', 'equipo', 'servicio');

-- ── 1. Usuarios ──────────────────────────────────────────────
CREATE TABLE usuarios (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           VARCHAR(100)   NOT NULL,
  apellido         VARCHAR(100),
  email            VARCHAR(255)   NOT NULL UNIQUE,
  password_hash    VARCHAR(255)   NOT NULL,
  telefono         VARCHAR(20),
  rol              rol_usuario    NOT NULL DEFAULT 'comprador',
  avatar_url       VARCHAR(500),
  activo           BOOLEAN        NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  last_login_at    TIMESTAMPTZ
);

-- Datos específicos de pescador
ALTER TABLE usuarios ADD COLUMN caleta_principal   VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN embarcacion        VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN licencia_produce   VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN metodo_pago        VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN empresa            VARCHAR(100);

CREATE INDEX idx_usuarios_email   ON usuarios (email);
CREATE INDEX idx_usuarios_rol     ON usuarios (rol);
CREATE INDEX idx_usuarios_caleta  ON usuarios (caleta_principal);

-- ── 2. Caletas ───────────────────────────────────────────────
CREATE TABLE caletas (
  id               SERIAL       PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL UNIQUE,
  distrito         VARCHAR(100) NOT NULL,
  region           VARCHAR(100) NOT NULL DEFAULT 'Piura',
  latitud          DECIMAL(9,6) NOT NULL,
  longitud         DECIMAL(9,6) NOT NULL,
  estado           estado_caleta NOT NULL DEFAULT 'abierto',
  pescadores       INTEGER      NOT NULL DEFAULT 0,
  embarcaciones    INTEGER      NOT NULL DEFAULT 0,
  viento           VARCHAR(30),
  temperatura_mar  VARCHAR(10),
  oleaje           VARCHAR(10),
  descripcion      TEXT,
  color_mapa       VARCHAR(7)   DEFAULT '#10b981',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_caletas_estado   ON caletas (estado);
CREATE INDEX idx_caletas_distrito ON caletas (distrito);

-- ── 3. Precios por Caleta ────────────────────────────────────
CREATE TABLE precios_caleta (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  caleta_id        INTEGER         NOT NULL REFERENCES caletas(id) ON DELETE CASCADE,
  especie          VARCHAR(100)    NOT NULL,
  precio           DECIMAL(10,2)   NOT NULL CHECK (precio >= 0),
  tendencia        tendencia_precio NOT NULL,
  actualizado_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_precios_caleta_caleta  ON precios_caleta (caleta_id);
CREATE INDEX idx_precios_caleta_especie ON precios_caleta (especie);

-- ── 4. Precios de Lonja (mercado mayorista) ──────────────────
CREATE TABLE precios_lonja (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  especie          VARCHAR(100)    NOT NULL,
  precio           DECIMAL(10,2)   NOT NULL CHECK (precio >= 0),
  cambio_pct       VARCHAR(5),
  tendencia        tendencia_precio NOT NULL,
  fecha            DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_precios_lonja_fecha   ON precios_lonja (fecha DESC);
CREATE INDEX idx_precios_lonja_especie ON precios_lonja (especie);
-- Para el dashboard: último precio de cada especie
CREATE UNIQUE INDEX idx_precios_lonja_hoy ON precios_lonja (especie, fecha);

-- ── 5. Capturas ──────────────────────────────────────────────
CREATE TABLE capturas (
  id                 UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  pescador_id        UUID            NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  especie            VARCHAR(100)    NOT NULL,
  caleta_origen      VARCHAR(100)    NOT NULL,
  cantidad_kg        DECIMAL(10,2)   NOT NULL CHECK (cantidad_kg > 0),
  precio_por_kg      DECIMAL(10,2)   NOT NULL CHECK (precio_por_kg >= 0),
  fecha_hora_captura TIMESTAMPTZ     NOT NULL,
  metodo_pesca       metodo_pesca    NOT NULL,
  observaciones      TEXT,
  foto_url           VARCHAR(500),
  estado             estado_captura  NOT NULL DEFAULT 'pendiente',
  batch_id           VARCHAR(20)     UNIQUE,
  certificado_sernapesca BOOLEAN     DEFAULT false,
  created_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_capturas_pescador    ON capturas (pescador_id);
CREATE INDEX idx_capturas_estado      ON capturas (estado);
CREATE INDEX idx_capturas_especie     ON capturas (especie);
CREATE INDEX idx_capturas_fecha       ON capturas (fecha_hora_captura DESC);
-- Query común: capturas activas de un pescador
CREATE INDEX idx_capturas_pescador_estado ON capturas (pescador_id, estado);

-- ── 6. Ofertas (Marketplace) ─────────────────────────────────
CREATE TABLE ofertas (
  id                 VARCHAR(20)     PRIMARY KEY,
  captura_id         UUID            NOT NULL UNIQUE REFERENCES capturas(id) ON DELETE CASCADE,
  pescador_id        UUID            NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  especie            VARCHAR(100)    NOT NULL,
  caleta             VARCHAR(100)    NOT NULL,
  fecha_publicacion  DATE            NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento  DATE            NOT NULL,
  peso_capturado_kg  DECIMAL(10,2)   NOT NULL CHECK (peso_capturado_kg > 0),
  peso_disponible_kg DECIMAL(10,2)   NOT NULL CHECK (peso_disponible_kg >= 0),
  precio_por_kg      DECIMAL(10,2)   NOT NULL CHECK (precio_por_kg >= 0),
  metodo_pesca       VARCHAR(50)     NOT NULL,
  estado             estado_oferta   NOT NULL DEFAULT 'pendiente',
  visitas            INTEGER         NOT NULL DEFAULT 0,
  reservas           INTEGER         NOT NULL DEFAULT 0,
  destacado          BOOLEAN         NOT NULL DEFAULT false,
  descripcion        TEXT,
  certificado        BOOLEAN         NOT NULL DEFAULT false,
  categoria          categoria_producto,
  created_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ofertas_pescador     ON ofertas (pescador_id);
CREATE INDEX idx_ofertas_estado       ON ofertas (estado);
CREATE INDEX idx_ofertas_especie      ON ofertas (especie);
CREATE INDEX idx_ofertas_categoria    ON ofertas (categoria);
CREATE INDEX idx_ofertas_vencimiento  ON ofertas (fecha_vencimiento);
-- Query principal del marketplace: ofertas activas con stock
CREATE INDEX idx_ofertas_activas ON ofertas (estado, peso_disponible_kg)
  WHERE estado = 'publicado' AND peso_disponible_kg > 0;
-- Búsqueda por texto en marketplace
CREATE INDEX idx_ofertas_busqueda ON ofertas
  USING gin(to_tsvector('spanish', especie || ' ' || caleta || ' ' || descripcion));

-- ── 7. Carrito de Compras ────────────────────────────────────
CREATE TABLE carrito_items (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID            NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  oferta_id        VARCHAR(20)     NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
  cantidad_kg      DECIMAL(10,2)   NOT NULL CHECK (cantidad_kg > 0),
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ
);

CREATE INDEX idx_carrito_usuario ON carrito_items (usuario_id);
-- Un item por oferta por usuario
CREATE UNIQUE INDEX idx_carrito_usuario_oferta ON carrito_items (usuario_id, oferta_id);

-- ── 8. Favoritos ─────────────────────────────────────────────
CREATE TABLE favoritos (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID            NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  oferta_id        VARCHAR(20)     NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, oferta_id)
);

CREATE INDEX idx_favoritos_usuario ON favoritos (usuario_id);

-- ── 9. Órdenes de Compra ─────────────────────────────────────
CREATE TABLE ordenes_compra (
  id               VARCHAR(20)   PRIMARY KEY,
  comprador_id     UUID          NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  proveedor_nombre VARCHAR(100)  NOT NULL,
  tipo             tipo_orden    NOT NULL DEFAULT 'producto_pesca',
  producto_nombre  VARCHAR(200)  NOT NULL,
  fecha_orden      DATE          NOT NULL DEFAULT CURRENT_DATE,
  cantidad         VARCHAR(30)   NOT NULL,
  cantidad_numero  DECIMAL(10,2),
  unidad_medida    VARCHAR(10),
  total            DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  estado           estado_orden  NOT NULL DEFAULT 'pendiente',
  factura_url      VARCHAR(500),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordenes_comprador ON ordenes_compra (comprador_id);
CREATE INDEX idx_ordenes_estado    ON ordenes_compra (estado);
CREATE INDEX idx_ordenes_fecha     ON ordenes_compra (fecha_orden DESC);

-- ── 10. Items de Órdenes ─────────────────────────────────────
CREATE TABLE orden_items (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id         VARCHAR(20)     NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  oferta_id        VARCHAR(20)     REFERENCES ofertas(id),
  producto_nombre  VARCHAR(200)    NOT NULL,
  cantidad_kg      DECIMAL(10,2)   NOT NULL,
  precio_unitario  DECIMAL(10,2)   NOT NULL,
  subtotal         DECIMAL(12,2)   NOT NULL
);

CREATE INDEX idx_orden_items_orden ON orden_items (orden_id);

-- ── 11. Trazabilidad QR (Lotes) ──────────────────────────────
CREATE TABLE lotes_trazabilidad (
  id                  VARCHAR(20)   PRIMARY KEY,
  captura_id          UUID          NOT NULL REFERENCES capturas(id) ON DELETE CASCADE,
  pescador_id         UUID          NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  especie             VARCHAR(100)  NOT NULL,
  caleta              VARCHAR(100)  NOT NULL,
  fecha_captura       DATE          NOT NULL,
  peso_kg             DECIMAL(10,2) NOT NULL CHECK (peso_kg > 0),
  precio_kg           DECIMAL(10,2) NOT NULL CHECK (precio_kg >= 0),
  metodo_pesca        VARCHAR(50)   NOT NULL,
  estado              estado_lote   NOT NULL DEFAULT 'pendiente',
  qr_generado         BOOLEAN       NOT NULL DEFAULT false,
  qr_data_url         VARCHAR(500),
  sernapesca_validado BOOLEAN       NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lotes_pescador  ON lotes_trazabilidad (pescador_id);
CREATE INDEX idx_lotes_captura   ON lotes_trazabilidad (captura_id);
CREATE INDEX idx_lotes_estado    ON lotes_trazabilidad (estado);

-- ── 12. Proveedores (Insumos/Equipos) ───────────────────────
CREATE TABLE proveedores (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           VARCHAR(150)  NOT NULL UNIQUE,
  rubro            VARCHAR(50),
  contacto         VARCHAR(100),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 13. Notificaciones Preferencias ─────────────────────────
CREATE TABLE notificaciones_preferencias (
  usuario_id            UUID    PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nuevos_precios_lonja  BOOLEAN NOT NULL DEFAULT true,
  ofertas_reservadas    BOOLEAN NOT NULL DEFAULT true,
  alertas_clima         BOOLEAN NOT NULL DEFAULT true,
  newsletter            BOOLEAN NOT NULL DEFAULT false,
  actividad_cuenta      BOOLEAN NOT NULL DEFAULT true
);

-- ── 14. Sesiones / Refresh Tokens ────────────────────────────
CREATE TABLE sesiones (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID          NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  refresh_token    TEXT          NOT NULL,
  user_agent       TEXT,
  ip_address       VARCHAR(45),
  expires_at       TIMESTAMPTZ   NOT NULL,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sesiones_usuario  ON sesiones (usuario_id);
CREATE INDEX idx_sesiones_token    ON sesiones (refresh_token);

-- ── 15. Notificaciones (push/in-app) ─────────────────────────
CREATE TABLE notificaciones (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID            NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo             VARCHAR(30)     NOT NULL,
  titulo           VARCHAR(200)    NOT NULL,
  mensaje          TEXT,
  leida            BOOLEAN         NOT NULL DEFAULT false,
  link             VARCHAR(500),
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones (usuario_id, leida, created_at DESC);

-- ── Funciones útiles ─────────────────────────────────────────

-- Auto-generar ID de oferta: OF-YYYY-{correlativo}
CREATE SEQUENCE seq_oferta_id START 1;

CREATE OR REPLACE FUNCTION generar_oferta_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  correlativo TEXT;
BEGIN
  correlativo := LPAD(nextval('seq_oferta_id')::TEXT, 3, '0');
  RETURN 'OF-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || correlativo;
END;
$$ LANGUAGE plpgsql;

-- Auto-generar Batch ID de trazabilidad
CREATE SEQUENCE seq_batch_id START 1;

CREATE OR REPLACE FUNCTION generar_batch_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  correlativo TEXT;
BEGIN
  correlativo := LPAD(nextval('seq_batch_id')::TEXT, 3, '0');
  RETURN 'LT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || correlativo;
END;
$$ LANGUAGE plpgsql;

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

CREATE TRIGGER trg_capturas_updated_at
  BEFORE UPDATE ON capturas
  FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

CREATE TRIGGER trg_ofertas_updated_at
  BEFORE UPDATE ON ofertas
  FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

CREATE TRIGGER trg_caletas_updated_at
  BEFORE UPDATE ON caletas
  FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

-- ── Vistas para consultas frecuentes ─────────────────────────

-- Vista del marketplace: ofertas activas con stock
CREATE VIEW marketplace_activo AS
SELECT
  o.id,
  o.pescador_id,
  u.nombre AS vendedor_nombre,
  o.especie,
  o.caleta,
  o.precio_por_kg,
  o.peso_disponible_kg,
  (o.peso_capturado_kg - o.peso_disponible_kg) AS kg_vendidos,
  o.peso_capturado_kg,
  o.destacado,
  o.certificado,
  o.descripcion,
  o.metodo_pesca,
  o.categoria,
  o.fecha_publicacion,
  o.fecha_vencimiento,
  o.visitas,
  o.reservas,
  EXTRACT(EPOCH FROM ((o.fecha_vencimiento - CURRENT_DATE) || ' days')::INTERVAL) / 3600 AS horas_restantes,
  o.created_at
FROM ofertas o
JOIN usuarios u ON u.id = o.pescador_id
WHERE o.estado = 'publicado' AND o.peso_disponible_kg > 0;

-- Dashboard del pescador: stats agregadas
CREATE VIEW dashboard_pescador AS
SELECT
  u.id AS pescador_id,
  COALESCE(SUM(CASE WHEN o.estado = 'publicado' THEN (o.peso_capturado_kg - o.peso_disponible_kg) * o.precio_por_kg ELSE 0 END), 0) AS total_ventas_mes,
  COALESCE(SUM(CASE WHEN o.estado = 'publicado' THEN o.peso_capturado_kg - o.peso_disponible_kg ELSE 0 END), 0) AS kg_vendidos,
  COUNT(CASE WHEN o.estado = 'publicado' THEN 1 END) AS ofertas_activas,
  COUNT(CASE WHEN o.estado = 'vendido' THEN 1 END) AS ofertas_vendidas,
  COUNT(*) AS total_ofertas
FROM usuarios u
LEFT JOIN ofertas o ON o.pescador_id = u.id
  AND o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
WHERE u.rol = 'pescador'
GROUP BY u.id;

-- ── Datos iniciales (seeds) ──────────────────────────────────

INSERT INTO caletas (nombre, distrito, latitud, longitud, estado, pescadores, embarcaciones, viento, temperatura_mar, oleaje, descripcion) VALUES
  ('Parachique',    'Sechura', -5.5742, -80.8701, 'abierto', 340, 87,  '12 km/h NO', '22°C', '0.8 m', 'Principal caleta de Sechura. Alta actividad de pesca pelágica, anchoveta y merluza.'),
  ('Bayóvar',       'Sechura', -5.7983, -81.0326, 'abierto', 120, 34,  '8 km/h O',  '21°C', '0.6 m', 'Zona pesquera artesanal cercana al terminal portuario. Especializada en mariscos.'),
  ('Yacila',        'Paita',   -4.9800, -81.1100, 'abierto', 210, 62,  '14 km/h NO', '23°C', '1.0 m', 'Caleta pintoresca de Paita. Alta valoración por pargo y especies de fondo.'),
  ('Puerto Paita',  'Paita',   -5.0900, -81.1140, 'abierto', 680, 195, '10 km/h O',  '22°C', '0.9 m', 'Puerto principal del norte de Perú. Mayor volumen de desembarque de la región Piura.'),
  ('El Ñuro',       'Talara',  -4.5150, -81.2420, 'abierto', 95,  28,  '9 km/h SO',  '24°C', '0.5 m', 'Famosa por avistamiento de tortugas. Pesca artesanal de alto valor.'),
  ('Los Órganos',   'Talara',  -4.1763, -81.1245, 'alerta',  145, 41,  '22 km/h NO', '22°C', '1.8 m', 'Alerta por oleaje moderado-alto. Salida solo para embarcaciones mayores.'),
  ('Máncora',       'Talara',  -4.1058, -81.0453, 'cerrado', 0,   0,   '28 km/h N',  '23°C', '2.5 m', 'Puerto cerrado preventivamente por marejadas. IMARPE recomienda no salir.');

INSERT INTO precios_lonja (especie, precio, cambio_pct, tendencia, fecha) VALUES
  ('Huachinango', 32.00, '+5%', 'up',   CURRENT_DATE),
  ('Atún Aleta',  85.50, '+12%', 'up',   CURRENT_DATE),
  ('Langostino',  48.00, '-3%',  'down', CURRENT_DATE),
  ('Corvina',     14.00, '+15%', 'up',   CURRENT_DATE);

INSERT INTO proveedores (nombre, rubro) VALUES
  ('Insumos Marinos SAC', 'Insumos'),
  ('Petromar Perú',       'Combustible'),
  ('FríoMar Piura',       'Servicios'),
  ('TacklePerú',          'Equipos'),
  ('Astillero El Chaco',  'Servicios'),
  ('MotoMar Piura',       'Equipos'),
  ('TechPesca',           'Equipos'),
  ('SafeMar Equipos',     'Insumos');
