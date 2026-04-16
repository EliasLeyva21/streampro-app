import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, TrendingUp, 
  Package, Edit3, Trash2, Key, Mail
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- COMPONENTE DE LOGIN (Para evitar la pantalla negra) ---
function AuthView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <form onSubmit={handleLogin} className="bg-slate-950 p-10 rounded-[3rem] border border-slate-900 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
           <div className="bg-blue-600/10 p-4 rounded-2xl">
              <Monitor size={40} className="text-blue-500" />
           </div>
        </div>
        <h2 className="text-3xl font-black text-white italic mb-2 text-center uppercase tracking-tighter">StreamPro</h2>
        <p className="text-slate-500 text-center text-xs font-bold mb-8 uppercase tracking-widest">Panel de Administración</p>
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Correo electrónico" 
            className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Contraseña" 
            className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Entrar al Sistema'}
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Estados Formulario Clientes
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [vencimiento, setVencimiento] = useState('');

  // Estados Formulario Inventario
  const [invCorreo, setInvCorreo] = useState('');
  const [invPass, setInvPass] = useState('');
  const [invServicio, setInvServicio] = useState('');
  const [invTotales, setInvTotales] = useState(5);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) { fetchRegistros(session.user.id); fetchInventario(session.user.id); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) { fetchRegistros(session.user.id); fetchInventario(session.user.id); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchRegistros = async (uId) => {
    const { data } = await supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_registro', { ascending: false });
    if (data) setRegistros(data);
  };

  const fetchInventario = async (uId) => {
    const { data } = await supabase.from('inventario').select('*').eq('user_id', uId).order('id', { ascending: false });
    if (data) setInventario(data);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const payload = { nombre_negocio: nombre, whatsapp, servicio, monto: parseFloat(monto), fecha_vencimiento: vencimiento, user_id: session.user.id };
    if (editId) await supabase.from('proveedores').update(payload).eq('id', editId);
    else await supabase.from('proveedores').insert([payload]);
    cerrarModal(); fetchRegistros(session.user.id);
  };

  const handleGuardarInventario = async (e) => {
    e.preventDefault();
    if (!invServicio) return alert("Selecciona un servicio");
    const payload = { correo: invCorreo, password: invPass, servicio: invServicio, perfiles_totales: parseInt(invTotales), perfiles_libres: parseInt(invTotales), estado: 'Disponible', user_id: session.user.id };
    const { error } = await supabase.from('inventario').insert([payload]);
    if (error) alert("Error: " + error.message);
    else { setInvCorreo(''); setInvPass(''); setInvServicio(''); setIsInvModalOpen(false); fetchInventario(session.user.id); }
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm('¿Eliminar este cliente?')) {
      await supabase.from('proveedores').delete().eq('id', id);
      fetchRegistros(session.user.id);
    }
  };

  const abrirEditar = (item) => {
    setEditId(item.id); setNombre(item.nombre_negocio); setWhatsapp(item.whatsapp);
    setServicio(item.servicio); setMonto(item.monto); setVencimiento(item.fecha_vencimiento);
    setIsModalOpen(true);
  };

  const cerrarModal = () => { setIsModalOpen(false); setEditId(null); setNombre(''); setWhatsapp(''); setServicio(''); setMonto(''); setVencimiento(''); };

  // --- VISTA: INVENTARIO ---
  const InventarioView = () => (
    <div className="p-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Inventario</h2>
        <button onClick={() => setIsInvModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-lg transition-all">
          <PlusCircle size={18}/> Agregar Cuenta
        </button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {['Netflix', 'Disney+', 'Spotify', 'HBO Max'].map(srv => (
          <div key={srv} className="bg-slate-950 border border-slate-900 p-6 rounded-3xl">
            <p className="text-slate-600 text-[10px] font-black uppercase italic">{srv}</p>
            <h4 className="text-2xl font-black italic text-blue-500">
              {inventario.filter(i => i.servicio === srv).reduce((acc, c) => acc + (c.perfiles_libres || 0), 0)} Libres
            </h4>
          </div>
        ))}
      </div>
      <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-slate-600 text-[10px] font-black uppercase border-b border-slate-900">
            <tr><th className="px-8 py-5">Servicio</th><th className="px-8 py-5">Acceso</th><th className="px-8 py-5 text-center">Stock</th><th className="px-8 py-5 text-center">Estado</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {inventario.map(item => (
              <tr key={item.id} className="hover:bg-blue-600/[0.02]">
                <td className="px-8 py-6 font-bold text-slate-200 italic">{item.servicio}</td>
                <td className="px-8 py-6">
                  <div className="flex flex-col text-xs">
                    <span className="text-white font-mono flex items-center gap-2"><Mail size={12}/> {item.correo}</span>
                    <span className="text-slate-500 font-mono flex items-center gap-2"><Key size={12}/> {item.password}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center font-black text-blue-500">{item.perfiles_libres}/{item.perfiles_totales}</td>
                <td className="px-8 py-6 text-center"><span className="bg-emerald-900/20 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">{item.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // SI NO HAY SESIÓN, MOSTRAR LOGIN EN LUGAR DE PANTALLA NEGRA
  if (!session) return <AuthView />;

  return (
    <div className="min-h-screen bg-black text-slate-300 flex font-sans">
      <aside className="w-72 bg-slate-950 border-r border-slate-900 p-8 flex flex-col gap-10">
        <h1 className="text-2xl font-black text-blue-500 italic flex items-center gap-3"><Monitor size={28}/> STREAMPRO</h1>
        <nav className="flex-1 space-y-2">
          {[{ id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20}/> }, { id: 'clientes', label: 'Clientes', icon: <Users size={20}/> }, { id: 'inventario', label: 'Inventario', icon: <Package size={20}/> }].map(item => (
            <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black italic transition-all ${vistaActual === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-600 hover:text-slate-300'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-red-500/50 p-4 font-black italic hover:text-red-400 mt-auto"><LogOut size={22}/> SALIR</button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {vistaActual === 'dashboard' && (
          <div className="p-10 animate-in fade-in">
             <header className="flex justify-between items-end mb-10">
                <div><h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Panel Principal</h2></div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl">
                  <PlusCircle size={20}/> Nuevo Registro
                </button>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem]">
                   <h3 className="text-[10px] font-black text-slate-600 uppercase mb-6 italic tracking-widest flex items-center gap-2"><TrendingUp size={14}/> Crecimiento</h3>
                   <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={registros.length > 0 ? registros.slice(0, 10).reverse() : [{monto:0}]}><Area type="monotone" dataKey="monto" stroke="#3b82f6" strokeWidth={4} fill="rgba(59, 130, 246, 0.1)" /></AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2rem] flex items-center justify-between border-l-4 border-l-emerald-500">
                      <div><p className="text-slate-500 text-[10px] font-black uppercase italic">Ventas Totales</p><h4 className="text-3xl font-black text-emerald-400 italic">S/. {registros.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}</h4></div>
                      <DollarSign className="text-slate-800" size={32}/>
                   </div>
                </div>
             </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
           <div className="p-10 animate-in fade-in">
              <header className="flex justify-between items-center mb-10"><h2 className="text-4xl font-black text-white italic uppercase">Clientes</h2><div className="relative w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18}/><input type="text" placeholder="Buscar cliente..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-12 text-sm text-white outline-none focus:border-blue-600 italic font-bold" onChange={(e) => setFiltro(e.target.value)} /></div></header>
              <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-900">
                    {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-blue-600/[0.02] transition-colors">
                        <td className="px-8 py-6 font-bold text-slate-200 italic text-lg">{item.nombre_negocio}</td>
                        <td className="px-8 py-6 text-blue-500 font-black text-[10px] uppercase italic tracking-widest">{item.servicio}</td>
                        <td className="px-8 py-6 text-slate-500 font-mono text-sm">{item.whatsapp}</td>
                        <td className="px-8 py-6 text-right space-x-3">
                          <button onClick={() => abrirEditar(item)} className="p-2 bg-slate-900 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => eliminarRegistro(item.id)} className="p-2 bg-slate-900 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}

        {vistaActual === 'inventario' && <InventarioView />}
      </main>

      {/* MODAL INVENTARIO */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black italic text-white uppercase">Nueva Cuenta</h3><button onClick={() => setIsInvModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarInventario} className="grid grid-cols-2 gap-4">
              <input required value={invCorreo} onChange={e => setInvCorreo(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Correo" />
              <input required value={invPass} onChange={e => setInvPass(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Contraseña" />
              <select required value={invServicio} onChange={e => setInvServicio(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600">
                <option value="">Servicio...</option><option value="Netflix">Netflix</option><option value="Disney+">Disney+</option><option value="Spotify">Spotify</option><option value="HBO Max">HBO Max</option>
              </select>
              <input required type="number" value={invTotales} onChange={e => setInvTotales(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Perfiles" />
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase mt-4 italic tracking-widest shadow-lg shadow-blue-900/40">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CLIENTES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-xl">
            <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-black italic text-white uppercase">{editId ? 'Editar Cliente' : 'Nueva Venta'}</h3><button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-4">
              <input required value={nombre} onChange={e => setNombre(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Nombre" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="WhatsApp" />
              <select required value={servicio} onChange={e => setServicio(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600">
                <option value="">Servicio...</option><option value="Netflix">Netflix</option><option value="Disney+">Disney+</option><option value="Spotify">Spotify</option><option value="HBO Max">HBO Max</option>
              </select>
              <input required type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Monto S/." />
              <input required type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-slate-500 italic font-bold outline-none focus:border-blue-600" />
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase mt-4 italic shadow-lg shadow-blue-900/40">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;