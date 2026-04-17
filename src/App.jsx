import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, Package, 
  Edit3, Trash2, Key, Mail, MessageCircle, Settings, Calendar, RefreshCw, PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Phone
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// --- LOGIN CON TU IMAGEN Y BOTÓN DE WHATSAPP ---
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
    <div className="min-h-screen bg-[#050509] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500">
        <form onSubmit={handleLogin} className="bg-slate-950 p-10 rounded-[3rem] border border-slate-900 shadow-2xl flex flex-col items-center">
          
          {/* TU IMAGEN DE MARCA PERSONAL */}
          <div className="w-32 h-32 mb-8 flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-800">
            <img 
              src="https://nzsxqmkhbzwpxjwwysnq.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-04-16%20at%208.14.02%20PM.jpeg" 
              alt="Marca Personal" 
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=LOGO'}
            />
          </div>

          <h2 className="text-3xl font-black text-white italic mb-1 text-center uppercase tracking-tighter">ZERO</h2>
          <p className="text-slate-600 text-center text-[10px] font-bold mb-8 uppercase tracking-widest italic">Inicia Sesión para Continuar</p>
          
          <div className="space-y-4 w-full mb-6">
            <input type="email" placeholder="Correo" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20">{loading ? '...' : 'ENTRAR AL SISTEMA'}</button>
          </div>

          <a href="https://wa.me/51902257451" target="_blank" className="flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-all italic">
            <MessageCircle size={14}/> ¿No tienes acceso? Contáctame
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPass, setShowPass] = useState(false);
  
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Estados Perfil
  const [userName, setUserName] = useState('Usuario Zero');
  const [userPhone, setUserPhone] = useState('');

  // Estados Formulario Clientes
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [vencimiento, setVencimiento] = useState('');

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
        await supabase.from('ventas').insert([{ cliente_id: data[0].id, monto: parseFloat(monto), metodo_pago: 'Venta Directa', user_id: session.user.id }]);
      }
    }
    cerrarModal(); cargarTodo(session.user.id);
  };

  const handleRenovacion = async (cliente) => {
    const fechaBase = new Date(cliente.fecha_vencimiento);
    fechaBase.setDate(fechaBase.getDate() + 30);
    const fechaISO = fechaBase.toISOString().split('T')[0];
    await supabase.from('proveedores').update({ fecha_vencimiento: fechaISO }).eq('id', cliente.id);
    await supabase.from('ventas').insert([{ cliente_id: cliente.id, monto: cliente.monto, metodo_pago: 'Renovación Directa', user_id: session.user.id }]);
    cargarTodo(session.user.id);
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm('¿Eliminar a este cliente?')) { 
      await supabase.from('proveedores').delete().eq('id', id); 
      cargarTodo(session.user.id); 
    }
  };

  const cerrarModal = () => { setIsModalOpen(false); setEditId(null); setNombre(''); setWhatsapp(''); setServicio(''); setMonto(''); setVencimiento(''); };
  const esAtrasado = (fecha) => new Date(fecha) < new Date();

  if (!session) return <AuthView />;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-hidden">
      
      {/* SIDEBAR ESTRECHO Y BLANCO */}
      <aside className={`bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 border-none opacity-0'}`}>
        <div className="p-8 flex flex-col h-full">
            <h1 className="text-3xl font-black text-white italic flex items-center gap-3 tracking-tighter mb-12"><Monitor size={28}/> ZERO</h1>
            <nav className="flex-1 space-y-2">
              {[
                { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={18}/> },
                { id: 'clientes', label: 'Clientes', icon: <Users size={18}/> },
                { id: 'stock', label: 'Stock', icon: <Package size={18}/> },
                { id: 'finanzas', label: 'Finanzas', icon: <DollarSign size={18}/> },
                { id: 'ajustes', label: 'Ajustes', icon: <Settings size={18}/> }
              ].map(item => (
                <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold italic transition-all text-[13px] ${vistaActual === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-600 hover:text-slate-300'}`}>
                    {item.icon} {item.label}
                </button>
              ))}
            </nav>
            <button onClick={() => supabase.auth.signOut()} className="text-red-900/70 p-4 font-black italic hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest mt-auto flex items-center gap-2"><LogOut size={14}/> Salir</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-[#080811]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-10 left-10 z-20 text-slate-700 hover:text-white transition-colors">
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
        </button>

        {vistaActual === 'dashboard' && (
          <div className="p-16 animate-in fade-in">
             <header className="mb-12 pt-2 flex justify-between items-center border-b border-slate-900 pb-8">
                <div>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Panel Principal</h2>
                  <p className="text-slate-600 font-bold italic text-xs mt-1 uppercase">Bienvenido de vuelta, {userName}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl transition-all">Nuevo Cliente</button>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-900 p-8 rounded-[3rem]">
                   <p className="text-slate-500 text-[10px] font-black uppercase italic mb-8">Flujo de Ingresos</p>
                   <div className="h-48"><ResponsiveContainer><AreaChart data={ventasHistoricas.slice(0,12).reverse()}><Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={4} /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-900 p-8 rounded-[3rem] border-l-4 border-l-emerald-500 shadow-2xl shadow-emerald-500/5">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic mb-1 tracking-widest">Ingresos Totales</p>
                    <h4 className="text-4xl font-black text-white italic tracking-tighter">S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}</h4>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 p-8 rounded-[3rem] border-l-4 border-l-red-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic mb-1 tracking-widest">Cuentas por Vencer</p>
                    <h4 className="text-4xl font-black text-red-500 italic tracking-tighter">{registros.filter(r => esAtrasado(r.fecha_vencimiento)).length}</h4>
                  </div>
                </div>
             </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
           <div className="p-16 animate-in fade-in">
              <header className="flex justify-between items-center mb-12 pt-2 border-b border-slate-900 pb-8">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2>
                <div className="relative w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18}/>
                  <input type="text" placeholder="Buscar por nombre..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-12 text-sm text-white font-bold italic outline-none focus:border-blue-600 transition-all" onChange={(e) => setFiltro(e.target.value)} />
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem] relative group hover:border-slate-700 transition-all shadow-xl shadow-black/20 flex flex-col gap-6 overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-slate-100 italic text-xl uppercase tracking-tighter">{item.nombre_negocio}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{item.servicio}</div>
                        </div>
                        <div className="font-black text-lg text-white">S/. {item.monto?.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-900 pt-6">
                       <div className={`flex items-center gap-2 text-xs font-black uppercase italic ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500' : 'text-emerald-500'}`}>
                         <Calendar size={14}/> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                       </div>
                       {/* BOTONES DE ACCIÓN VISIBLES AL HOVER */}
                       <div className="flex gap-1.5">
                          <button onClick={() => handleRenovacion(item)} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={14}/></button>
                          <button onClick={() => eliminarRegistro(item.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* --- SECCIÓN DE AJUSTES (PERSONALIZACIÓN) --- */}
        {vistaActual === 'ajustes' && (
          <div className="p-16 animate-in fade-in max-w-4xl">
            <h2 className="text-4xl font-black text-white italic uppercase mb-12 tracking-tighter pt-2 border-b border-slate-900 pb-8">Configuración</h2>
            <div className="space-y-8">
              
              {/* PERFIL DE USUARIO */}
              <div className="bg-slate-950 border border-slate-900 p-10 rounded-[3rem] space-y-8 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-6 border-b border-slate-900 pb-8">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl italic shadow-xl shadow-blue-900/30">Z</div>
                   <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase italic tracking-widest mb-1">Tu Cuenta</p>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{userName}</h3>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Nombre de Usuario</label>
                    <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18}/>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 text-sm font-bold text-white outline-none focus:border-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">WhatsApp de Soporte</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18}/>
                      <input type="text" placeholder="Ej: 51900000000" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 text-sm font-bold text-white outline-none focus:border-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Correo Electrónico (Registrado)</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18}/>
                      <input readOnly value={session.user.email} className="w-full bg-black/40 border border-slate-900 rounded-2xl py-4 pl-14 text-sm font-bold text-slate-500 cursor-not-allowed outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest ml-2">Cambiar Contraseña</label>
                    <div className="relative">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18}/>
                      <input type={showPass ? "text" : "password"} placeholder="Nueva contraseña..." className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 text-sm font-bold text-white outline-none focus:border-blue-600" />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-black py-5 rounded-[2rem] w-full font-black uppercase italic tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-black/20">Guardar Cambios del Perfil</button>
              </div>
            </div>
          </div>
        )}

        {/* RESTO DE VISTAS (STOCK Y FINANZAS) */}
        {vistaActual === 'stock' && <div className="p-16 animate-in fade-in"><h2 className="text-4xl font-black text-white italic uppercase mb-10 pt-2 border-b border-slate-900 pb-8">Inventario</h2>{/* Código de Stock similar a clientes */}</div>}
        {vistaActual === 'finanzas' && <div className="p-16 animate-in fade-in"><h2 className="text-4xl font-black text-white italic uppercase mb-10 pt-2 border-b border-slate-900 pb-8">Movimientos</h2>{/* Código de Finanzas */}</div>}

      </main>

      {/* MODAL REGISTRO (SIN CAMBIOS) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in zoom-in duration-300">
          <div className="bg-slate-950 border border-slate-800 p-12 rounded-[4rem] w-full max-w-lg shadow-2xl flex flex-col gap-8">
            <div className="flex justify-between items-center"><h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar' : 'Registro'}</h3><button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-5">
              <input required value={nombre} onChange={e => setNombre(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-3xl p-5 text-white font-bold" placeholder="Nombre del Cliente" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-3xl p-5 text-white font-bold" placeholder="WhatsApp (51...)" />
              <select required value={servicio} onChange={e => setServicio(e.target.value)} className="bg-black border border-slate-800 rounded-3xl p-5 text-white font-bold outline-none focus:border-blue-600 text-sm">
                <option value="">Servicio...</option><option value="Netflix">Netflix</option><option value="Disney+">Disney+</option><option value="Spotify">Spotify</option><option value="HBO Max">HBO Max</option>
              </select>
              <input required type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} className="bg-black border border-slate-800 rounded-3xl p-5 text-white font-bold" placeholder="Monto S/." />
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-4 italic tracking-widest">Vencimiento</label>
                <input required type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full bg-black border border-slate-800 rounded-3xl p-5 text-slate-500 font-bold text-sm" />
              </div>
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-6 rounded-3xl font-black uppercase mt-4 italic shadow-lg shadow-blue-900/40">Guardar Ahora</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;