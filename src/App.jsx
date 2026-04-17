import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import {
  LayoutDashboard, PlusCircle, X, LogOut, Monitor,
  Users, DollarSign, Search, Package, Edit3, Trash2,
  Settings, RefreshCw, PanelLeftClose, PanelLeftOpen,
  Eye, EyeOff, Save, Clock, ShieldAlert, Crown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- COMPONENTE DE LOGIN ---
function AuthView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      alert('Error de acceso: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <form onSubmit={handleLogin} className="bg-white/[0.02] backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-6 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center">
            <img
              src="https://nzsxqmkhbzwpxjwwysnq.supabase.co/storage/v1/object/public/assets/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e1e2f/white?text=ZERO'; }}
            />
          </div>
          <h2 className="text-4xl font-black italic mb-1 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 uppercase tracking-tighter">ZERO</h2>
          <p className="text-blue-400/50 text-[10px] font-black mb-10 uppercase tracking-[0.3em] italic">Intelligence Management</p>
          <div className="space-y-4 w-full mb-6">
            <input type="email" placeholder="Email" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 transition-all font-bold" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 transition-all font-bold" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl active:scale-95">
              {loading ? 'INICIANDO...' : 'ENTRAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- PANTALLA DE CUENTA BLOQUEADA ---
function BlockedView({ onSignOut }) {
  return (
    <div className="min-h-screen bg-[#0a0000] flex items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-900/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-800/10 blur-[100px] rounded-full"></div>
      <div className="z-10 text-center max-w-md animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 mx-auto mb-8 bg-red-600/10 border border-red-500/30 rounded-3xl flex items-center justify-center">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-3">ACCESO SUSPENDIDO</h2>
        <p className="text-red-400/70 text-xs font-black uppercase tracking-[0.3em] mb-8 italic">Suscripción vencida o inactiva</p>
        <div className="bg-red-950/30 border border-red-500/20 rounded-3xl p-8 mb-8 text-left space-y-3">
          <p className="text-slate-400 text-sm font-bold leading-relaxed">
            Tu cuenta ha sido <span className="text-red-400">suspendida</span> porque tu suscripción venció o fue desactivada por el administrador.
          </p>
          <p className="text-slate-500 text-xs leading-relaxed">
            Contacta al administrador del sistema para renovar tu acceso y continuar usando la plataforma.
          </p>
        </div>
        <button onClick={onSignOut} className="w-full bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 py-4 rounded-2xl font-black uppercase text-xs italic tracking-widest transition-all flex items-center justify-center gap-3">
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [sesionActiva, setSesionActiva] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);

  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [plataformaFiltro, setPlataformaFiltro] = useState('Todas');

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

  const verificarSuscripcion = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfiles_vendedores')
        .select('estado, fecha_vencimiento, es_admin')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setSesionActiva(false);
        return;
      }
      setEsAdmin(!!data.es_admin);
      if (!data.es_admin) {
        const hoy = new Date();
        const vencimiento = new Date(data.fecha_vencimiento);
        setSesionActiva(!(data.estado === 'inactivo' || hoy > vencimiento));
      } else {
        setSesionActiva(true);
      }
    } catch (err) {
      console.error('Error verificando suscripción:', err.message);
      setSesionActiva(false);
    }
  }, []);

  const cargarVendedores = useCallback(async () => {
    const { data } = await supabase
      .from('perfiles_vendedores')
      .select('id, email, estado, fecha_vencimiento, es_admin')
      .order('email', { ascending: true });
    if (data) setVendedores(data);
  }, []);

  const cambiarEstado = async (vendedorId, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const { error } = await supabase.from('perfiles_vendedores').update({ estado: nuevoEstado }).eq('id', vendedorId);
    if (!error) cargarVendedores();
    else alert('Error al cambiar estado: ' + error.message);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        verificarSuscripcion(session.user.id);
        cargarTodo(session.user.id);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        verificarSuscripcion(session.user.id);
        cargarTodo(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, [cargarTodo, verificarSuscripcion]);

  useEffect(() => {
    if (esAdmin) cargarVendedores();
  }, [esAdmin, cargarVendedores]);

  const calcularDiasRestantes = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fecha);
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento - hoy;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleGuardarNombre = () => {
    localStorage.setItem('zero_user_name', userName);
    alert('¡Nombre de administrador actualizado!');
  };

  const handleActualizarPassword = async () => {
    if (newPassword.length < 6) { alert('Mínimo 6 caracteres.'); return; }
    setUpdatingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert('Error: ' + error.message);
    else { alert('¡Éxito!'); setNewPassword(''); }
    setUpdatingPass(false);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const payload = {
      nombre_negocio: form.nombre,
      whatsapp: form.whatsapp,
      servicio: form.servicio,
      monto: parseFloat(form.monto),
      fecha_vencimiento: form.vencimiento,
      user_id: session.user.id
    };
    let result = editId
      ? await supabase.from('proveedores').update(payload).eq('id', editId)
      : await supabase.from('proveedores').insert([payload]).select();
    if (!editId && !result.error && result.data) {
      await supabase.from('ventas').insert([{
        cliente_id: result.data[0].id,
        monto: parseFloat(form.monto),
        metodo_pago: 'Venta',
        user_id: session.user.id
      }]);
    }
    if (result.error) alert(result.error.message);
    else { cerrarModal(); cargarTodo(session.user.id); }
  };

  const handleRenovacion = async (c) => {
    const f = new Date(c.fecha_vencimiento);
    f.setMonth(f.getMonth() + 1);
    const { error } = await supabase.from('proveedores').update({ fecha_vencimiento: f.toISOString().split('T')[0] }).eq('id', c.id);
    if (!error) {
      await supabase.from('ventas').insert([{
        cliente_id: c.id,
        monto: c.monto,
        metodo_pago: 'Renovación',
        user_id: session.user.id
      }]);
      cargarTodo(session.user.id);
    }
  };

  const abrirEdicion = (c) => {
    setEditId(c.id);
    setForm({ nombre: c.nombre_negocio, whatsapp: c.whatsapp, servicio: c.servicio, monto: c.monto, vencimiento: c.fecha_vencimiento });
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', whatsapp: '', servicio: '', monto: '', vencimiento: '' });
  };

  const registrosFiltrados = registros.filter(r => {
    const cumpleTexto = r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase()) || r.fecha_vencimiento.includes(filtro);
    const cumplePlataforma = plataformaFiltro === 'Todas' || r.servicio === plataformaFiltro;
    return cumpleTexto && cumplePlataforma;
  });

  if (!session) return <AuthView />;
  if (!sesionActiva) return <BlockedView onSignOut={() => supabase.auth.signOut()} />;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-hidden select-none">
      <aside className={`bg-black/20 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-500 z-30 ${isSidebarOpen ? 'w-72' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-16 px-2 text-white italic font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Monitor size={20} /></div>
            ZERO
            {esAdmin && <Crown size={14} className="text-yellow-400 ml-auto" />}
          </div>
          <nav className="flex-1 space-y-3">
            {[
              { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20} /> },
              { id: 'clientes', label: 'Clientes', icon: <Users size={20} /> },
              { id: 'stock', label: 'Stock', icon: <Package size={20} /> },
              { id: 'finanzas', label: 'Finanzas', icon: <DollarSign size={20} /> },
              ...(esAdmin ? [{ id: 'admin', label: 'Admin', icon: <Crown size={20} /> }] : []),
              { id: 'ajustes', label: 'Ajustes', icon: <Settings size={20} /> }
            ].map(item => (
              <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all text-[13px] ${vistaActual === item.id ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white'} ${item.id === 'admin' ? 'border border-yellow-500/20 text-yellow-500/70 hover:text-yellow-400' : ''}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center gap-3 p-4 text-slate-600 hover:text-red-400 font-bold transition-all text-xs uppercase tracking-widest">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-12 py-10 relative bg-[#080811]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`fixed top-14 z-50 bg-white/5 p-3 rounded-2xl border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all shadow-2xl backdrop-blur-md ${isSidebarOpen ? 'left-80' : 'left-10'}`}>
          {isSidebarOpen ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </button>

        {/* DASHBOARD */}
        {vistaActual === 'dashboard' && (
          <div className="animate-in fade-in duration-700 max-w-7xl mx-auto">
            <header className="mb-12 pt-4 flex items-center gap-4">
              <div className="w-16"></div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Dashboard</h2>
            </header>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] h-80">
                <p className="text-slate-400 text-[10px] font-black uppercase italic mb-8 tracking-widest">Ingresos Recientes</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ventasHistoricas.slice(0, 10).reverse()}>
                    <Area type="monotone" dataKey="monto" stroke="#3b82f6" fill="#3b82f633" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-12 lg:col-span-4 grid gap-6">
                <div className="bg-blue-600 p-8 rounded-[3rem] shadow-xl">
                  <p className="text-blue-200 text-[10px] font-black uppercase mb-2 italic">Total Recaudado</p>
                  <h4 className="text-4xl font-black text-white italic">
                    S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}
                  </h4>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] border-l-4 border-l-orange-500">
                  <p className="text-slate-500 text-[10px] font-black uppercase mb-2 italic">Cobros de Hoy</p>
                  <h4 className="text-4xl font-black text-white italic">
                    {registros.filter(r => r.fecha_vencimiento === new Date().toISOString().split('T')[0]).length} <span className="text-xs text-slate-500">Pendientes</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {vistaActual === 'clientes' && (
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16"></div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Cartera</h2>
              </div>
              <div className="flex gap-4">
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="text" placeholder="Buscar nombre o fecha (AAAA-MM-DD)..." className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 text-xs font-bold outline-none focus:border-white/20" onChange={(e) => setFiltro(e.target.value)} />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all">
                  <PlusCircle size={18} /> Nuevo
                </button>
              </div>
            </header>
            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
              <div className="w-16"></div>
              {['Todas', 'Netflix', 'Disney+', 'Spotify', 'Magis TV', 'Amazon Prime', 'HBO Max'].map(p => (
                <button key={p} onClick={() => setPlataformaFiltro(p)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${plataformaFiltro === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registrosFiltrados.map(item => {
                const dias = calcularDiasRestantes(item.fecha_vencimiento);
                return (
                  <div key={item.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] hover:border-blue-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-black text-white italic text-2xl uppercase group-hover:text-blue-400 transition-colors">{item.nombre_negocio}</h3>
                        <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{item.servicio}</div>
                      </div>
                      <span className="text-xl font-black text-white">S/. {item.monto?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="space-y-1">
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${dias < 0 ? 'text-red-500' : dias <= 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          <Clock size={14} /> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                        </div>
                        <div className="text-[9px] font-bold text-slate-600 uppercase">
                          {dias === 0 ? "¡Vence hoy!" : dias > 0 ? `Faltan ${dias} días` : `Venció hace ${Math.abs(dias)} días`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => abrirEdicion(item)} className="p-2 text-slate-500 hover:text-white"><Edit3 size={16} /></button>
                        <button onClick={() => handleRenovacion(item)} className="p-2 text-emerald-500 hover:scale-110"><RefreshCw size={16} /></button>
                        <button onClick={() => { if (window.confirm('¿Eliminar?')) supabase.from('proveedores').delete().eq('id', item.id).then(() => cargarTodo(session.user.id)); }} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STOCK */}
        {vistaActual === 'stock' && (
          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-12 pt-4">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Stock</h2>
              <button onClick={() => setIsInvModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">+ Inversión</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inventario.map(i => (
                <div key={i.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative group">
                  <button onClick={() => supabase.from('inventario').delete().eq('id', i.id).then(() => cargarTodo(session.user.id))} className="absolute top-6 right-6 text-white/10 group-hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <p className="text-slate-500 text-[10px] font-black uppercase italic mb-2 tracking-widest">Cuentas Compradas</p>
                  <h3 className="text-2xl font-black text-white italic uppercase mb-4">{i.servicio}</h3>
                  <div className="border-t border-white/5 pt-4 font-black text-red-500 text-xs italic">
                    GASTO: S/. {i.costo_total?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANZAS */}
        {vistaActual === 'finanzas' && (
          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
            <h2 className="text-5xl font-black text-white italic uppercase mb-12 pt-4 tracking-tighter">Historial</h2>
            <div className="space-y-3">
              {ventasHistoricas.map(v => (
                <div key={v.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex justify-between items-center hover:bg-white/[0.04] transition-all">
                  <div className="flex gap-6 items-center italic">
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{new Date(v.fecha_pago).toLocaleDateString()}</span>
                    <span className="text-white font-black uppercase text-sm">{v.proveedores?.nombre_negocio || 'Venta Rápida'}</span>
                  </div>
                  <span className="text-emerald-500 font-black italic">S/. {v.monto?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL ADMIN */}
        {vistaActual === 'admin' && esAdmin && (
          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-12 pt-4">
              <div className="flex items-center gap-4">
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Admin</h2>
                <span className="text-yellow-500/50 text-[10px] font-black uppercase tracking-[0.3em] italic border border-yellow-500/20 px-3 py-1 rounded-full">Supremo</span>
              </div>
              <button onClick={cargarVendedores} className="text-slate-500 hover:text-white p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                <RefreshCw size={16} />
              </button>
            </header>
            <div className="bg-white/[0.02] border border-yellow-500/20 rounded-[3rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-yellow-500/10 flex items-center gap-3">
                <Crown size={16} className="text-yellow-500" />
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest italic">Panel Supremo — Gestión de Vendedores</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vendedor</th>
                      <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                      <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimiento</th>
                      <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rol</th>
                      <th className="text-left p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedores.map(v => {
                      const diasRestantes = v.fecha_vencimiento ? calcularDiasRestantes(v.fecha_vencimiento) : null;
                      return (
                        <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all">
                          <td className="p-6"><span className="font-black text-white text-sm italic">{v.email}</span></td>
                          <td className="p-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${v.estado === 'activo' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                              {v.estado}
                            </span>
                          </td>
                          <td className="p-6">
                            <div>
                              <span className="text-slate-400 text-xs font-bold">{v.fecha_vencimiento || '—'}</span>
                              {diasRestantes !== null && (
                                <div className={`text-[9px] font-black uppercase mt-1 ${diasRestantes < 0 ? 'text-red-500' : diasRestantes <= 3 ? 'text-orange-500' : 'text-slate-600'}`}>
                                  {diasRestantes < 0 ? `Venció hace ${Math.abs(diasRestantes)}d` : diasRestantes === 0 ? 'Vence hoy' : `${diasRestantes}d restantes`}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-6">
                            {v.es_admin
                              ? <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1"><Crown size={12} /> Admin</span>
                              : <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vendedor</span>
                            }
                          </td>
                          <td className="p-6">
                            {!v.es_admin && (
                              <button onClick={() => cambiarEstado(v.id, v.estado)} className={`px-5 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border ${v.estado === 'activo' ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}>
                                {v.estado === 'activo' ? 'Suspender' : 'Activar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {vendedores.length === 0 && (
                      <tr><td colSpan={5} className="p-12 text-center text-slate-600 text-xs font-bold italic uppercase">No hay vendedores registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AJUSTES */}
        {vistaActual === 'ajustes' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h2 className="text-5xl font-black text-white italic uppercase mb-12 pt-4 tracking-tighter">Ajustes</h2>
            <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[3.5rem] space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nombre del Administrador</label>
                <div className="flex gap-4">
                  <input value={userName} onChange={(e) => setUserName(e.target.value)} className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50" />
                  <button onClick={handleGuardarNombre} className="bg-white text-black px-8 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                    <Save size={16} /> Guardar Nombre
                  </button>
                </div>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Sistema</label>
                  <input readOnly value={session.user.email} className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-slate-600 font-bold cursor-not-allowed" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nueva Contraseña</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>
              <button disabled={updatingPass} onClick={handleActualizarPassword} className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
                <RefreshCw size={16} className={updatingPass ? 'animate-spin' : ''} /> {updatingPass ? 'PROCESANDO...' : 'ACTUALIZAR CONTRASEÑA'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in zoom-in duration-300">
          <div className="bg-[#0a0a0f] border border-white/10 p-12 rounded-[3.5rem] w-full max-w-xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar' : 'Venta'}</h3>
              <button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={28} /></button>
            </div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-6">
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" placeholder="Nombre completo" />
              <input required value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" placeholder="WhatsApp (519...)" />
              <select required value={form.servicio} onChange={e => setForm({ ...form, servicio: e.target.value })} className="bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none appearance-none">
                <option value="" className="bg-slate-900">Servicio...</option>
                {['Netflix', 'Disney+', 'Spotify', 'Magis TV', 'Amazon Prime', 'HBO Max'].map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
              <input required type="number" step="0.01" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} className="bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" placeholder="Precio S/." />
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 ml-5 uppercase italic mb-1 block tracking-widest">Fecha Vencimiento</label>
                <input required type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-slate-400 font-bold outline-none" />
              </div>
              <button type="submit" className="col-span-2 bg-blue-600 py-6 rounded-2xl font-black uppercase italic tracking-widest shadow-2xl">GUARDAR REGISTRO</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STOCK */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in zoom-in duration-300">
          <div className="bg-[#0a0a0f] border border-white/10 p-12 rounded-[3.5rem] w-full max-w-md text-white text-center">
            <h3 className="text-3xl font-black italic text-white uppercase mb-10 tracking-tighter">Inversión</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await supabase.from('inventario').insert([{ servicio: invForm.servicio, costo_total: parseFloat(invForm.costo), user_id: session.user.id }]);
              setIsInvModalOpen(false); setInvForm({ servicio: '', costo: '' }); cargarTodo(session.user.id);
            }} className="space-y-6">
              <input required value={invForm.servicio} onChange={e => setInvForm({ ...invForm, servicio: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" placeholder="Cuenta / Proveedor" />
              <input required type="number" step="0.01" value={invForm.costo} onChange={e => setInvForm({ ...invForm, costo: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" placeholder="Costo Total S/." />
              <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-widest">GUARDAR STOCK</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;