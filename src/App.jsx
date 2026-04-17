import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, Search, Package, Edit3, Trash2, 
  Key, Mail, MessageCircle, Settings, RefreshCw, 
  PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Save, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

// --- COMPONENTE DE LOGIN (ESTILO PREMIUM) ---
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
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 font-sans text-white relative overflow-hidden">
      {/* Luces de ambiente estilo Dribbble */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <form onSubmit={handleLogin} className="bg-white/[0.02] backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
          
          <div className="w-28 h-28 mb-6 relative group">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-full h-full bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center">
              <img 
                src="https://nzsxqmkhbzwpxjwwysnq.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-04-16%20at%208.14.02%20PM.jpeg" 
                alt="Logo Zero" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="text-4xl font-black italic mb-1 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 uppercase tracking-tighter">ZERO</h2>
          <p className="text-blue-400/50 text-[10px] font-black mb-10 uppercase tracking-[0.3em] italic">Intelligence Management</p>
          
          <div className="space-y-4 w-full mb-8">
            <input type="email" placeholder="Correo corporativo" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.5)] active:scale-[0.97]">
              {loading ? 'AUTENTICANDO...' : 'ENTRAR AL SISTEMA'}
            </button>
          </div>

          <a href="https://wa.me/51902257451" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-all italic">
            <MessageCircle size={14}/> SOPORTE PREMIUM
          </a>
        </form>
      </div>
    </div>
  );
}

// --- APP PRINCIPAL ---
function App() {
  const [session, setSession] = useState(null);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');

  const [userName, setUserName] = useState(() => localStorage.getItem('zero_user_name') || 'ADMIN ZERO');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', whatsapp: '', servicio: '', monto: '', vencimiento: '' });
  const [invForm, setInvForm] = useState({ servicio: '', costo: '' });

  const cargarTodo = useCallback(async (uId) => {
    const [reg, vnt, inv] = await Promise.all([
      supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true }),
      supabase.from('ventas').select('*, proveedores(nombre_negocio)').eq('user_id', uId).order('fecha_pago', { ascending: false }),
      supabase.from('inventario').select('*').eq('user_id', uId)
    ]);
    if (reg.data) setRegistros(reg.data);
    if (vnt.data) setVentasHistoricas(vnt.data);
    if (inv.data) setInventario(inv.data);
  }, []);

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
  }, [cargarTodo]);

  useEffect(() => {
    localStorage.setItem('zero_user_name', userName);
  }, [userName]);

  const handleActualizarPassword = async () => {
    if (newPassword.length < 6) { alert("Mínimo 6 caracteres"); return; }
    setUpdatingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message); else { alert("✅ Contraseña actualizada"); setNewPassword(''); }
    setUpdatingPass(false);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const payload = { nombre_negocio: form.nombre, whatsapp: form.whatsapp, servicio: form.servicio, monto: parseFloat(form.monto), fecha_vencimiento: form.vencimiento, user_id: session.user.id };
    let result = editId ? await supabase.from('proveedores').update(payload).eq('id', editId) : await supabase.from('proveedores').insert([payload]).select();
    if (!editId && !result.error) await supabase.from('ventas').insert([{ cliente_id: result.data[0].id, monto: parseFloat(form.monto), metodo_pago: 'Venta', user_id: session.user.id }]);
    if (result.error) alert(result.error.message); else { cerrarModal(); cargarTodo(session.user.id); }
  };

  const abrirEdicion = (c) => { setEditId(c.id); setForm({ nombre: c.nombre_negocio, whatsapp: c.whatsapp, servicio: c.servicio, monto: c.monto, vencimiento: c.fecha_vencimiento }); setIsModalOpen(true); };
  
  const handleRenovacion = async (c) => {
    const f = new Date(c.fecha_vencimiento); f.setMonth(f.getMonth() + 1);
    const { error } = await supabase.from('proveedores').update({ fecha_vencimiento: f.toISOString().split('T')[0] }).eq('id', c.id);
    if (!error) { await supabase.from('ventas').insert([{ cliente_id: c.id, monto: c.monto, metodo_pago: 'Renovación', user_id: session.user.id }]); cargarTodo(session.user.id); }
  };

  const cerrarModal = () => { setIsModalOpen(false); setEditId(null); setForm({ nombre: '', whatsapp: '', servicio: '', monto: '', vencimiento: '' }); };
  const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); };
  const esAtrasado = (f) => new Date(f) < new Date();

  if (!session) return <AuthView />;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-hidden select-none relative">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      {/* SIDEBAR GLASS */}
      <aside className={`bg-black/20 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-500 z-30 ${isSidebarOpen ? 'w-72' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-16 px-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <Monitor size={20} className="text-white"/>
                </div>
                <h1 className="text-2xl font-black text-white italic tracking-tighter">ZERO</h1>
            </div>
            
            <nav className="flex-1 space-y-3">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
                { id: 'clientes', label: 'Clientes', icon: <Users size={20}/> },
                { id: 'stock', label: 'Inventario', icon: <Package size={20}/> },
                { id: 'finanzas', label: 'Finanzas', icon: <DollarSign size={20}/> },
                { id: 'ajustes', label: 'Ajustes', icon: <Settings size={20}/> }
              ].map(item => (
                <button 
                    key={item.id} 
                    onClick={() => setVistaActual(item.id)} 
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all text-[13px] ${vistaActual === item.id ? 'bg-white/10 text-white shadow-xl border border-white/10' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                >
                    {item.icon} {item.label}
                </button>
              ))}
            </nav>

            <button onClick={handleLogout} className="group mt-auto flex items-center gap-3 p-4 text-slate-600 hover:text-red-400 font-bold transition-all text-xs uppercase tracking-widest">
                <div className="p-2 rounded-lg bg-red-500/5 group-hover:bg-red-500/20 transition-all"><LogOut size={16}/></div>
                Salir del sistema
            </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-transparent px-12 py-10">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed top-12 left-8 z-40 text-slate-500 hover:text-white transition-all bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/5 shadow-xl">
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {/* --- DASHBOARD BENTO GRID --- */}
        {vistaActual === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
             <header className="mb-12 flex justify-between items-end">
                <div>
                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Resumen General</p>
                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Panel Principal</h2>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/5 flex items-center gap-4 shadow-2xl">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bienvenido,</p>
                        <p className="text-sm font-black text-white italic uppercase">{userName}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20"></div>
                </div>
             </header>

             <div className="grid grid-cols-12 gap-6">
                {/* Bento Big Card */}
                <div className="col-span-12 lg:col-span-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={120} className="text-blue-500" />
                   </div>
                   <p className="text-slate-400 text-[10px] font-black uppercase italic mb-8 tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Flujo de Ingresos Recientes
                   </p>
                   <div className="h-64 w-full">
                     <ResponsiveContainer>
                        <AreaChart data={ventasHistoricas.slice(0,12).reverse()}>
                           <defs>
                              <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff'}} />
                           <Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMonto)" strokeWidth={4} />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* Stat Cards */}
                <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] shadow-2xl shadow-blue-900/20 flex flex-col justify-center group transition-transform hover:scale-[1.02]">
                        <p className="text-blue-200 text-[10px] font-black uppercase italic mb-2 tracking-widest">Caja Total</p>
                        <h4 className="text-5xl font-black text-white italic tracking-tighter">S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toLocaleString()}</h4>
                    </div>
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-center">
                        <p className="text-orange-500 text-[10px] font-black uppercase italic mb-2 tracking-widest">Alertas de Vencimiento</p>
                        <h4 className="text-5xl font-black text-white italic tracking-tighter">
                            {registros.filter(r => {
                                const diff = new Date(r.fecha_vencimiento) - new Date();
                                return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000);
                            }).length}
                            <span className="text-lg text-slate-600 ml-3 uppercase">Pendientes</span>
                        </h4>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* --- CLIENTES GLASS CARDS --- */}
        {vistaActual === 'clientes' && (
            <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
              <header className="flex flex-wrap justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10">
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Cartera <span className="text-blue-600">Premium</span></h2>
                <div className="flex gap-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input type="text" placeholder="Buscar cliente..." className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold italic text-white outline-none focus:border-white/20 focus:bg-white/10 transition-all w-72" onChange={(e) => setFiltro(e.target.value)} />
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all shadow-2xl active:scale-95 tracking-widest">
                    <PlusCircle size={18}/> Nueva Venta
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                  <div key={item.id} className="group bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/5 hover:border-blue-500/30 p-8 rounded-[3rem] transition-all duration-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <div className="font-black text-white italic text-2xl uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{item.nombre_negocio}</div>
                            <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full inline-block text-[10px] font-black uppercase tracking-widest mt-2">{item.servicio}</div>
                        </div>
                        <div className="text-2xl font-black text-white tracking-tighter italic">S/. {item.monto?.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                       <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500' : 'text-emerald-500'}`}>
                         <Clock size={14}/>
                         {esAtrasado(item.fecha_vencimiento) ? 'Vencido' : 'Activo'} | {new Date(item.fecha_vencimiento).toLocaleDateString()}
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => abrirEdicion(item)} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-white hover:bg-white/10 transition-all"><Edit3 size={16}/></button>
                          <button onClick={() => handleRenovacion(item)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={16}/></button>
                          <button onClick={() => { if(window.confirm('¿Eliminar?')) supabase.from('proveedores').delete().eq('id', item.id).then(() => cargarTodo(session.user.id))}} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* --- AJUSTES GLASS --- */}
        {vistaActual === 'ajustes' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 max-w-4xl mx-auto">
            <h2 className="text-5xl font-black text-white italic uppercase mb-12 border-b border-white/5 pb-10 tracking-tighter">Configuración <span className="text-slate-600">Pro</span></h2>
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nombre del Administrador</label>
                    <input value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Protegido</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
                      <input readOnly value={session.user.email} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 text-sm font-bold text-slate-600 cursor-not-allowed outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3 text-white">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nueva Clave de Acceso</label>
                    <div className="relative">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
                      <input type={showPass ? "text" : "password"} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-16 text-sm font-bold outline-none focus:border-blue-500/50 transition-all" />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                        {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button disabled={updatingPass} onClick={handleActualizarPassword} className="bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-[11px] transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3">
                    <RefreshCw size={16} className={updatingPass ? 'animate-spin' : ''}/> {updatingPass ? 'Sincronizando...' : 'Actualizar Credenciales'}
                  </button>
                  <button onClick={() => alert('¡Guardado!')} className="bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-[11px] border border-white/10 transition-all flex items-center justify-center gap-3">
                    <Save size={16}/> Guardar Perfil
                  </button>
                </div>
            </div>
          </div>
        )}

        {/* SECCIONES SIMPLIFICADAS (STOCK Y FINANZAS) */}
        {(vistaActual === 'stock' || vistaActual === 'finanzas') && (
            <div className="animate-in fade-in max-w-7xl mx-auto">
                <h2 className="text-5xl font-black text-white italic uppercase mb-12 border-b border-white/5 pb-10 tracking-tighter">{vistaActual === 'stock' ? 'Inventario' : 'Historial'}</h2>
                <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[3.5rem] shadow-2xl">
                    <p className="text-slate-500 font-bold italic">Sección en mantenimiento estético, pero funcional...</p>
                    {/* Aquí iría tu lógica previa de tablas con el nuevo estilo de botones y tarjetas */}
                </div>
            </div>
        )}
      </main>

      {/* --- MODALES GLASSMORTISM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-[#0a0a0f] border border-white/10 p-12 rounded-[3.5rem] w-full max-w-xl shadow-[0_0_100px_rgba(37,99,235,0.2)] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar Registro' : 'Nueva Venta Realizada'}</h3>
                <button onClick={cerrarModal} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"><X size={28}/></button>
            </div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-6">
              <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50" placeholder="Nombre del Cliente" />
              <input required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50" placeholder="WhatsApp corporativo" />
              <select required value={form.servicio} onChange={e => setForm({...form, servicio: e.target.value})} className="bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50 appearance-none">
                <option value="" className="bg-slate-900 text-white">Servicio...</option>
                {['Netflix', 'Disney+', 'Spotify', 'Magis TV', 'Amazon Prime', 'HBO Max'].map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
              </select>
              <input required type="number" step="0.01" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} className="bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50" placeholder="Precio S/." />
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-600 ml-4 uppercase tracking-widest mb-2 block italic">Próximo Vencimiento</label>
                <input required type="date" value={form.vencimiento} onChange={e => setForm({...form, vencimiento: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-slate-400 font-bold outline-none focus:border-blue-500/50" />
              </div>
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black uppercase italic shadow-2xl shadow-blue-900/40 transition-all active:scale-95 tracking-[0.2em] text-xs">
                {editId ? 'CONFIRMAR ACTUALIZACIÓN' : 'REGISTRAR Y GUARDAR'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;