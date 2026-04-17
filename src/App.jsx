import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, Package, 
  Edit3, Trash2, Key, Mail, MessageCircle, Settings, Calendar, RefreshCw, PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Phone,Clock
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// --- VISTA DE AUTENTICACIÓN ---
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
    <div className="min-h-screen bg-[#050509] flex items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500">
        <form onSubmit={handleLogin} className="bg-slate-950 p-10 rounded-[3rem] border border-slate-900 shadow-2xl flex flex-col items-center">
          <div className="w-32 h-32 mb-8 flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-800 bg-white">
            <img 
              src="https://fuxshvghqjizfxtggrle.supabase.co/storage/v1/object/public/assets/marca_personal.png" 
              alt="Logo Zero" 
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h2 className="text-3xl font-black italic mb-1 uppercase tracking-tighter">ZERO</h2>
          <p className="text-slate-600 text-[10px] font-bold mb-8 uppercase tracking-widest italic">Inicia Sesión</p>
          <div className="space-y-4 w-full mb-6">
            <input type="email" placeholder="Correo" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20">{loading ? '...' : 'ENTRAR'}</button>
          </div>
          <a href="https://wa.me/519XXXXXXXX" target="_blank" className="flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-all italic tracking-tighter">
            <MessageCircle size={14}/> SOPORTE VENTAS
          </a>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPass, setShowPass] = useState(false);
  
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Perfil
  const [userName, setUserName] = useState('ADMIN ZERO');

  // Form Clientes
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [vencimiento, setVencimiento] = useState('');

  // Form Inventario
  const [invServicio, setInvServicio] = useState('');
  const [invCosto, setInvCosto] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) cargarTodo(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) cargarTodo(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const cargarTodo = (uId) => {
    fetchRegistros(uId);
    fetchVentas(uId);
    fetchInventario(uId);
  };

  const fetchRegistros = async (uId) => {
    const { data } = await supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true });
    if (data) setRegistros(data);
  };

  const fetchVentas = async (uId) => {
    const { data } = await supabase.from('ventas').select('*, proveedores(nombre_negocio)').eq('user_id', uId).order('fecha_pago', { ascending: false });
    if (data) setVentasHistoricas(data);
  };

  const fetchInventario = async (uId) => {
    const { data } = await supabase.from('inventario').select('*').eq('user_id', uId);
    if (data) setInventario(data);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const payload = { nombre_negocio: nombre, whatsapp, servicio, monto: parseFloat(monto), fecha_vencimiento: vencimiento, user_id: session.user.id };
    if (editId) {
      await supabase.from('proveedores').update(payload).eq('id', editId);
    } else {
      const { data, error } = await supabase.from('proveedores').insert([payload]).select();
      if (!error && data) {
        await supabase.from('ventas').insert([{ cliente_id: data[0].id, monto: parseFloat(monto), metodo_pago: 'Venta', user_id: session.user.id }]);
      }
    }
    cerrarModal(); cargarTodo(session.user.id);
  };

  const handleGuardarInventario = async (e) => {
    e.preventDefault();
    await supabase.from('inventario').insert([{ servicio: invServicio, costo_total: parseFloat(invCosto), user_id: session.user.id }]);
    setIsInvModalOpen(false); setInvServicio(''); setInvCosto(''); cargarTodo(session.user.id);
  };

  const abrirEdicion = (cliente) => {
    setEditId(cliente.id); setNombre(cliente.nombre_negocio); setWhatsapp(cliente.whatsapp); setServicio(cliente.servicio); setMonto(cliente.monto); setVencimiento(cliente.fecha_vencimiento); setIsModalOpen(true);
  };

  const handleRenovacion = async (cliente) => {
    const f = new Date(cliente.fecha_vencimiento); f.setMonth(f.getMonth() + 1);
    await supabase.from('proveedores').update({ fecha_vencimiento: f.toISOString().split('T')[0] }).eq('id', cliente.id);
    await supabase.from('ventas').insert([{ cliente_id: cliente.id, monto: cliente.monto, metodo_pago: 'Renovación', user_id: session.user.id }]);
    cargarTodo(session.user.id);
  };

  const cerrarModal = () => { setIsModalOpen(false); setEditId(null); setNombre(''); setWhatsapp(''); setServicio(''); setMonto(''); setVencimiento(''); };
  const esAtrasado = (f) => new Date(f) < new Date();
  
  // Lógica para "Próximos a vencer" (Próximos 3 días)
  const proximosAVencer = registros.filter(r => {
    const diff = new Date(r.fecha_vencimiento) - new Date();
    return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000);
  });

  if (!session) return <AuthView />;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-8 flex flex-col h-full">
            <h1 className="text-2xl font-black text-white italic flex items-center gap-3 tracking-tighter mb-12"><Monitor size={24}/> ZERO</h1>
            <nav className="flex-1 space-y-2">
              {[
                { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={18}/> },
                { id: 'clientes', label: 'Clientes', icon: <Users size={18}/> },
                { id: 'stock', label: 'Stock', icon: <Package size={18}/> },
                { id: 'finanzas', label: 'Finanzas', icon: <DollarSign size={18}/> },
                { id: 'ajustes', label: 'Ajustes', icon: <Settings size={18}/> }
              ].map(item => (
                <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold italic transition-all text-[13px] ${vistaActual === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}>
                    {item.icon} {item.label}
                </button>
              ))}
            </nav>
            <button onClick={() => supabase.auth.signOut()} className="text-red-900/70 p-4 font-black italic hover:text-red-500 uppercase text-[10px] tracking-widest mt-auto flex items-center gap-2"><LogOut size={14}/> Salir</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-[#080811]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-10 left-10 z-20 text-slate-700 hover:text-white">
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
        </button>

        {/* --- PANEL PRINCIPAL (MÁS COMPACTO) --- */}
        {vistaActual === 'dashboard' && (
          <div className="p-16 animate-in fade-in max-w-6xl">
             <header className="mb-8 pt-2">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Dashboard</h2>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-900 p-6 rounded-[2rem]">
                   <p className="text-slate-500 text-[9px] font-black uppercase italic mb-6">Gráfica de Movimientos</p>
                   <div className="h-32"><ResponsiveContainer><AreaChart data={ventasHistoricas.slice(0,8).reverse()}><Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-6 rounded-[2rem] flex flex-col justify-center">
                    <p className="text-slate-500 text-[9px] font-black uppercase italic mb-1">Ingresos</p>
                    <h4 className="text-3xl font-black text-white italic tracking-tighter">S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}</h4>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-6 rounded-[2rem] border-l-4 border-l-orange-500 flex flex-col justify-center">
                    <p className="text-slate-500 text-[9px] font-black uppercase italic mb-1">Cerca de Vencer</p>
                    <h4 className="text-3xl font-black text-orange-500 italic tracking-tighter">{proximosAVencer.length}</h4>
                </div>
             </div>
          </div>
        )}

        {/* --- CLIENTES (CON BOTÓN NUEVO) --- */}
        {vistaActual === 'clientes' && (
           <div className="p-16 animate-in fade-in">
              <header className="flex justify-between items-center mb-12 pt-2 border-b border-slate-900 pb-8">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2>
                <div className="flex gap-4">
                  <div className="relative w-64 text-white">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                    <input type="text" placeholder="Buscar..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-3 pl-12 text-xs font-bold italic outline-none" onChange={(e) => setFiltro(e.target.value)} />
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-blue-600 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 transition-all shadow-xl shadow-white/5"><PlusCircle size={16}/> Nuevo Cliente</button>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem] flex flex-col gap-6 hover:border-slate-700 transition-all shadow-2xl shadow-black/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-slate-100 italic text-xl uppercase tracking-tighter">{item.nombre_negocio}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{item.servicio}</div>
                        </div>
                        <div className="font-black text-lg text-white">S/. {item.monto?.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-900 pt-6">
                       <div className={`text-[10px] font-black uppercase italic ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                         Vence: {new Date(item.fecha_vencimiento).toLocaleDateString()}
                       </div>
                       <div className="flex gap-1.5">
                          <button onClick={() => abrirEdicion(item)} className="p-2 bg-slate-900 text-slate-400 rounded-xl hover:text-white transition-all"><Edit3 size={14}/></button>
                          <button onClick={() => handleRenovacion(item)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={14}/></button>
                          <button onClick={() => { if(window.confirm('¿Eliminar?')) supabase.from('proveedores').delete().eq('id', item.id).then(() => cargarTodo(session.user.id))}} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* --- STOCK / INVENTARIO (CON BOTÓN) --- */}
        {vistaActual === 'stock' && (
           <div className="p-16 animate-in fade-in">
              <header className="flex justify-between items-center mb-12 border-b border-slate-900 pb-8">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Inventario</h2>
                <button onClick={() => setIsInvModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-900/30">+ Agregar Inversión</button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {inventario.map(i => (
                  <div key={i.id} className="bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem]">
                    <div className="text-slate-500 text-[10px] font-black uppercase italic mb-2 tracking-widest">Cuenta Stock</div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{i.servicio}</h3>
                    <div className="border-t border-slate-900 pt-4 flex justify-between items-center">
                      <span className="text-[10px] font-black text-red-500 uppercase italic">Inversión: S/. {i.costo_total?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* --- FINANZAS (RESTAURADO) --- */}
        {vistaActual === 'finanzas' && (
           <div className="p-16 animate-in fade-in max-w-5xl">
              <h2 className="text-4xl font-black text-white italic uppercase mb-12 border-b border-slate-900 pb-8">Historial Financiero</h2>
              <div className="space-y-3">
                {ventasHistoricas.map(v => (
                  <div key={v.id} className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex justify-between items-center hover:border-blue-900/30 transition-all">
                    <div className="flex gap-6 items-center italic">
                       <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">{new Date(v.fecha_pago).toLocaleDateString()}</span>
                       <span className="text-white font-black uppercase text-sm">{v.proveedores?.nombre_negocio || 'Cliente'}</span>
                    </div>
                    <span className="text-emerald-500 font-black italic tracking-tighter">S/. {v.monto?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* --- AJUSTES (LIMPIO Y CON OJITO) --- */}
        {vistaActual === 'ajustes' && (
          <div className="p-16 animate-in fade-in max-w-4xl">
            <h2 className="text-4xl font-black text-white italic uppercase mb-12 border-b border-slate-900 pb-8">Ajustes</h2>
            <div className="bg-slate-950 border border-slate-900 p-10 rounded-[3rem] space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 col-span-2 text-white">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Nombre de Perfil</label>
                    <input value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-blue-600" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Correo de Acceso</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                      <input readOnly value={session.user.email} className="w-full bg-black/40 border border-slate-900 rounded-2xl py-4 pl-14 text-sm font-bold text-slate-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Contraseña</label>
                    <div className="relative">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                      <input type={showPass ? "text" : "password"} readOnly value="12345678" className="w-full bg-black/40 border border-slate-900 rounded-2xl py-4 pl-14 text-sm font-bold text-slate-500 outline-none" />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => alert('Nombre de perfil actualizado localmente')} className="bg-white text-black py-5 rounded-2xl w-full font-black uppercase italic tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all">Guardar Cambios</button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-lg animate-in zoom-in">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black italic text-white uppercase">{editId ? 'Editar' : 'Nuevo Registro'}</h3><button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-4">
              <input required value={nombre} onChange={e => setNombre(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="Nombre" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="WhatsApp" />
              <select required value={servicio} onChange={e => setServicio(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none"><option value="">Servicio...</option><option value="Netflix">Netflix</option><option value="Disney+">Disney+</option><option value="Spotify">Spotify</option><option value="Magis TV">Magis TV</option></select>
              <input required type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="Monto S/." />
              <div className="col-span-2"><label className="text-[10px] font-black text-slate-600 ml-4 uppercase italic tracking-widest">Fecha Vencimiento</label><input required type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-slate-500 font-bold" /></div>
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase italic shadow-lg shadow-blue-900/40">Guardar Ahora</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INVENTARIO */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-sm">
            <h3 className="text-2xl font-black italic text-white uppercase mb-6 tracking-tighter">Nueva Inversión</h3>
            <form onSubmit={handleGuardarInventario} className="space-y-4">
              <input required placeholder="Ej: Netflix 4K (10 cuentas)" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invServicio} onChange={e => setInvServicio(e.target.value)} />
              <input required type="number" step="0.01" placeholder="Costo Total S/." className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invCosto} onChange={e => setInvCosto(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic shadow-lg shadow-blue-900/40">Registrar Compra</button>
              <button onClick={() => setIsInvModalOpen(false)} className="w-full text-slate-600 font-bold uppercase text-[10px] tracking-widest mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;