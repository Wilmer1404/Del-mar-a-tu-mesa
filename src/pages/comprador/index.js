/**
 * Mapa y Configuración del Comprador
 * Wrappers delgados que reutilizan el mismo contenido
 * pero con CompradorLayout.
 */

// ── CompradorMapa ─────────────────────────────────────────────────────────────
import { lazy, Suspense } from 'react';
import { CompradorLayout } from '../../layouts/CompradorLayout';

// Reutilizamos el contenido exacto del mapa del pescador
import MapaCaletasPage from '../pescador/MapaCaletas';
import ConfiguracionPage from '../pescador/Configuracion';

/**
 * Para reutilizar MapaCaletas y Configuracion con CompradorLayout,
 * hacemos un patch temporal: como esos componentes usan DashboardLayout
 * internamente, los re-exportamos como variantes envueltas.
 *
 * Estrategia: extraer el contenido puro en versiones futuras.
 * Por ahora, los copiamos con su propio layout.
 */
export { default as CompradorMapa }   from './CompradorMapa';
export { default as CompradorConfig } from './CompradorConfig';
