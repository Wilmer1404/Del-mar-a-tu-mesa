import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, ShoppingCart, Heart, Star,
  MapPin, BadgeCheck, Flame, Clock, X, Store, Package,
  TrendingUp, Zap, Fish,
} from 'lucide-react';
import { CompradorLayout } from '../../layouts/CompradorLayout';


const CATEGORIAS = [
  { key: 'todos', label: 'Todos', emoji: '🌊' },
  { key: 'peces', label: 'Peces', emoji: '🐟' },
  { key: 'crustaceos', label: 'Crustáceos', emoji: '🦐' },
  { key: 'cefalopodos', label: 'Cefalópodos', emoji: '🦑' },
];

const SORT_OPTIONS = [
  { value: 'reciente',   label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc',label: 'Precio: mayor a menor' },
  { value: 'rating',     label: 'Mejor valorados' },
];

const EMOJIS = { peces: '🐟', crustaceos: '🦐', cefalopodos: '🦑' };

function mapOferta(item) {
  const horasRestantes = item.fecha_vencimiento
    ? Math.max(0, Math.floor((new Date(item.fecha_vencimiento) - new Date()) / (1000 * 60 * 60)))
    : 0;
  return {
    id: item.id,
    especie: item.especie,
    vendedor: item.vendedor_nombre,
    caleta: item.caleta,
    precioPorKg: Number(item.precio_por_kg) || 0,
    kgDisponible: Number(item.peso_disponible_kg) || 0,
    emoji: EMOJIS[item.categoria] || '🐟',
    rating: 4.8,
    certificado: !!item.certificado,
    destacado: !!item.destacado,
    horasRestantes,
    categoria: item.categoria,
    descripcion: item.descripcion,
  };
}

const MOCK_PRODUCTOS = [
  { id: '1', especie: 'Huachinango del Pacífico', vendedor: 'Cap. Arturo Prat', caleta: 'Parachique',   precioPorKg: 32.00, kgDisponible: 35, emoji: '🐟', rating: 4.9, certificado: true,  destacado: true,  horasRestantes: 48, categoria: 'peces',      descripcion: 'Captura fresca de esta mañana. Talla mediana-grande, sin golpes.' },
  { id: '2', especie: 'Langostino Jumbo',          vendedor: 'Juan Flores B.',  caleta: 'Bayóvar',      precioPorKg: 48.00, kgDisponible: 12, emoji: '🦐', rating: 4.7, certificado: true,  destacado: true,  horasRestantes: 6,  categoria: 'crustaceos', descripcion: 'Langostino entero, talla XL. Ideal restaurantes.' },
  { id: '3', especie: 'Atún Aleta Azul',           vendedor: 'Mario Quin.',    caleta: 'Yacila',        precioPorKg: 85.50, kgDisponible: 8,  emoji: '🐠', rating: 5.0, certificado: true,  destacado: false, horasRestantes: 12, categoria: 'peces',      descripcion: 'Premium grade, cadena de frío garantizada.' },
  { id: '4', especie: 'Corvina',                   vendedor: 'Carlos Mend.',   caleta: 'Puerto Paita', precioPorKg: 14.00, kgDisponible: 45, emoji: '🐡', rating: 4.5, certificado: false, destacado: false, horasRestantes: 72, categoria: 'peces',      descripcion: 'Corvina entera, método artesanal red.' },
  { id: '5', especie: 'Pota (calamar gigante)',     vendedor: 'Sara Vic.',      caleta: 'El Ñuro',      precioPorKg: 9.00,  kgDisponible: 80, emoji: '🦑', rating: 4.3, certificado: false, destacado: false, horasRestantes: 96, categoria: 'cefalopodos', descripcion: 'Pota limpia y fileteada. Gran volumen disponible.' },
  { id: '6', especie: 'Pargo Rojo',                vendedor: 'Pedro Lazo.',    caleta: 'Los Órganos',  precioPorKg: 20.00, kgDisponible: 22, emoji: '🐟', rating: 4.6, certificado: false, destacado: false, horasRestantes: 30, categoria: 'peces',      descripcion: 'Pargo de espinel, talla uniforme.' },
];

function useCart() {
  const [cart, setCart] = useState([]);
  const add    = (p) => setCart((c) => { const ex = c.find(i => i.id === p.id); return ex ? c.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...c, {...p, qty:1}]; });
  const remove = (id) => setCart((c) => c.filter(i => i.id !== id));
  const total  = cart.reduce((a, i) => a + i.precioPorKg * i.qty, 0);
  return { cart, add, remove, total };
}

function FreshnessChip({ horas }) {
  if (horas <= 8)  return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full"><Flame size={9}/> ¡Últimas horas!</span>;
  if (horas <= 24) return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><Clock size={9}/> {horas}h restantes</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full"><Clock size={9}/> {horas}h restantes</span>;
}

function ProductCard({ producto, onAdd, inCart }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col ${producto.destacado ? 'border-emerald-200 ring-1 ring-emerald-200' : 'border-slate-100'}`}>
      {producto.destacado && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold text-center py-1 tracking-widest uppercase flex items-center justify-center gap-1">
          <Zap size={9} /> Oferta Destacada
        </div>
      )}
      <div className="relative p-5 pb-3">
        <button onClick={() => setLiked(!liked)} className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${liked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}>
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-3xl flex-shrink-0 border border-emerald-100">{producto.emoji}</div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-tight truncate">{producto.especie}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate"><MapPin size={10}/> {producto.caleta}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400"/>
              <span className="text-[11px] font-bold text-slate-700">{producto.rating}</span>
              {producto.certificado && <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full"><BadgeCheck size={9}/> Cert.</span>}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{producto.descripcion}</p>
        <div className="flex items-center justify-between mb-3">
          <FreshnessChip horas={producto.horasRestantes}/>
          <span className="text-xs text-slate-400">{producto.kgDisponible} kg disp.</span>
        </div>
        <div className="text-right mb-1">
          <span className="text-2xl font-extrabold text-slate-900">S/ {producto.precioPorKg.toFixed(2)}</span>
          <span className="text-xs text-slate-400 font-medium"> / kg</span>
        </div>
        <p className="text-[10px] text-slate-400 text-right mb-1">por <span className="font-semibold text-slate-600">{producto.vendedor}</span></p>
      </div>
      <div className="px-5 pb-5 mt-auto">
        <button onClick={() => onAdd(producto)} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${inCart ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-md shadow-slate-900/10'}`}>
          <ShoppingCart size={15}/> {inCart ? '✓ En el carrito' : 'Reservar / Comprar'}
        </button>
      </div>
    </div>
  );
}

function CartPanel({ cart, onRemove, total, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-900">Mi Carrito</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-3"><ShoppingCart size={40} className="opacity-30"/><p className="text-sm font-medium">Tu carrito está vacío</p></div>
          ) : cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{item.especie}</p>
                <p className="text-xs text-slate-500">{item.qty} kg × S/ {item.precioPorKg.toFixed(2)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">S/ {(item.precioPorKg * item.qty).toFixed(2)}</p>
                <button onClick={() => onRemove(item.id)} className="text-[10px] text-red-400 hover:text-red-600">Quitar</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal ({cart.length} productos)</span>
              <span className="font-extrabold text-slate-900">S/ {total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">Confirmar Reserva →</button>
            <Link to="/comprador/compras" className="block text-center text-xs text-emerald-600 font-semibold hover:text-emerald-700">Ver Mis Compras</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompradorMarketplace() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]     = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [sort, setSort]         = useState('reciente');
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, add, remove, total } = useCart();

  useEffect(() => {
    const t = setTimeout(() => { setProductos(MOCK_PRODUCTOS); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = productos
    .filter(p => {
      const matchSearch = p.especie.toLowerCase().includes(search.toLowerCase()) || p.vendedor.toLowerCase().includes(search.toLowerCase()) || p.caleta.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoria === 'todos' || p.categoria === categoria;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'precio_asc')  return a.precioPorKg - b.precioPorKg;
      if (sort === 'precio_desc') return b.precioPorKg - a.precioPorKg;
      if (sort === 'rating')      return b.rating - a.rating;
      return a.horasRestantes - b.horasRestantes;
    });

  const destacados = filtered.filter(p => p.destacado);
  const normales   = filtered.filter(p => !p.destacado);

  if (loading) {
    return (
      <CompradorLayout>
        <div className="max-w-screen-xl mx-auto flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </CompradorLayout>
    );
  }

  return (
    <CompradorLayout>
      {cartOpen && <CartPanel cart={cart} onRemove={remove} total={total} onClose={() => setCartOpen(false)}/>}
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Marketplace</h1>
            <p className="text-sm text-slate-500">Compra productos frescos directamente a los pescadores.</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors self-start sm:self-auto">
            <ShoppingCart size={16}/> Ver Carrito
            {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 rounded-full text-[10px] font-extrabold flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Ofertas disponibles', value: productos.length, icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Vendedores activos',   value: new Set(productos.map(p => p.vendedor)).size, icon: Fish, color: 'text-sky-500', bg: 'bg-sky-50' },
            { label: 'Ton. disponibles',     value: `${(productos.reduce((a,p) => a+p.kgDisponible,0)/1000).toFixed(1)}t`, icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Precio promedio/kg',   value: `S/ ${productos.length ? (productos.reduce((a,p) => a+p.precioPorKg,0)/productos.length).toFixed(2) : '0.00'}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(({label, value, icon: Icon, color, bg}) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`${bg} p-2 rounded-xl`}><Icon size={16} className={color}/></div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1 max-w-md">
            <Search size={14} className="text-slate-400"/>
            <input type="text" placeholder="Buscar especie, vendedor, caleta…" value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"/>
            {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><X size={13}/></button>}
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {CATEGORIAS.map(c => (
              <button key={c.key} onClick={() => setCategoria(c.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${categoria===c.key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
            <SlidersHorizontal size={14} className="text-slate-400"/>
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent text-sm text-slate-700 outline-none">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Destacados */}
        {destacados.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Zap size={15} className="text-emerald-500"/> Ofertas Destacadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {destacados.map(p => <ProductCard key={p.id} producto={p} onAdd={add} inCart={cart.some(c => c.id===p.id)}/>)}
            </div>
          </div>
        )}

        {/* Todas */}
        {normales.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Fish size={15} className="text-slate-500"/> Todas las Ofertas <span className="text-xs font-normal text-slate-400">({normales.length})</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {normales.map(p => <ProductCard key={p.id} producto={p} onAdd={add} inCart={cart.some(c => c.id===p.id)}/>)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">🌊</div>
            <p className="text-sm font-semibold text-slate-600">No se encontraron productos.</p>
          </div>
        )}
      </div>
    </CompradorLayout>
  );
}
