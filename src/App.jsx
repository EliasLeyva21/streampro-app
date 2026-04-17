import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, Package, 
  Edit3, Trash2, Key, Mail, MessageCircle, Settings, Calendar, RefreshCw, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// --- VISTA DE ACCESO PERSONALIZADA CON IMAGEN DE MARCA ---
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
          
          {/* --- ESPACIO PARA TU IMAGEN DE MARCA --- */}
          <div className="w-24 h-24 bg-blue-600/10 border border-blue-900/30 rounded-3xl mb-8 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-950/20 overflow-hidden">
            {/* Reemplaza esta <img> por tu logo real */}
            <Monitor size={48} strokeWidth={1.5} />
            {/* <img src="/tu-logo-aqui.png" alt="Logo Marca" className="w-full h-full object-cover"/> */}
          </div>

          <h2 className="text-3xl font-black text-white italic mb-1 text-center uppercase tracking-tighter">ZERO</h2>
          <p className="text-slate-600 text-center text-[10px] font-bold mb-10 uppercase tracking-widest italic">StreamPro CRM v3.0</p>
          
          <div className="space-y-4 w-full">
            <input type="email" placeholder="Correo" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20">{loading ? '...' : 'ENTRAR'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // <--- NUEVO: ESTADO DEL SIDEBAR
  
  const [registros, setRegistros] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Estados Formulario Clientes
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicio, setServicio] = useState('');
  const [monto, setMonto] = useState('');
  const [vencimiento, setVencimiento] = useState('');

  useEffect(() => {
    document.title = "ZERO | CRM";
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
  };

  const fetchRegistros = async (uId) => {
    const { data } = await supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true });
    if (data) setRegistros(data);
  };

  const fetchVentas = async (uId) => {
    const { data } = await supabase.from('ventas').select('*, proveedores(nombre_negocio)').eq('user_id', uId).order('fecha_pago', { ascending: false });
    if (data) setVentasHistoricas(data);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const payload = { nombre_negocio: nombre, whatsapp, servicio, monto: parseFloat(monto), fecha_vencimiento: vencimiento, user_id: session.user.id };
    if (editId) {
      await supabase.from('proveedores').update(payload).eq('id', editId);
    } else {
      const { data, error } = await supabase.from('proveedores').insert([payload]).select();
      if (!error && data) {
        await supabase.from('ventas').insert([{ cliente_id: data[0].id, monto: parseFloat(monto), metodo_pago: 'Registro Inicial', user_id: session.user.id }]);
      }
    }
    cerrarModal(); 
    cargarTodo(session.user.id);
  };

  const handleRenovacion = async (cliente) => {
    const fechaBase = new Date(cliente.fecha_vencimiento);
    fechaBase.setDate(fechaBase.getDate() + 30);
    const fechaISO = fechaBase.toISOString().split('T')[0];
    await supabase.from('proveedores').update({ fecha_vencimiento: fechaISO }).eq('id', cliente.id);
    await supabase.from('ventas').insert([{ cliente_id: cliente.id, monto: cliente.monto, metodo_pago: 'Renovación Rápida', user_id: session.user.id }]);
    cargarTodo(session.user.id);
  };

  const enviarRecordatorio = (cliente) => {
    const msj = encodeURIComponent(`Hola ${cliente.nombre_negocio}, tu servicio de ${cliente.servicio} venció el ${new Date(cliente.fecha_vencimiento).toLocaleDateString()}. ¿Deseas renovar?`);
    window.open(`https://wa.me/${cliente.whatsapp}?text=${msj}`, '_blank');
  };

  const eliminarRegistro = async (id) => {
    if (window.confirm('¿Eliminar permanentemente?')) { 
      await supabase.from('proveedores').delete().eq('id', id); 
      cargarTodo(session.user.id); 
    }
  };

  const cerrarModal = () => { setIsModalOpen(false); setEditId(null); setNombre(''); setWhatsapp(''); setServicio(''); setMonto(''); setVencimiento(''); };
  const esAtrasado = (fecha) => new Date(fecha) < new Date();

  if (!session) return <AuthView />;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-hidden">
      
      {/* SIDEBAR COLAPSABLE Y MÁS ESTRECHO (w-64) */}
      <aside className={`bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 border-none'}`}>
        <div className="p-8 pb-10 flex flex-col gap-10 h-full overflow-hidden">
            <h1 className="text-3xl font-black text-white italic flex items-center gap-3 tracking-tighter shrink-0"><Monitor size={28}/> ZERO</h1>
            <nav className="flex-1 space-y-1">
              {[
                { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={18}/> },
                { id: 'clientes', label: 'Clientes', icon: <Users size={18}/> },
                { id: 'ventas', label: 'Finanzas', icon: <DollarSign size={18}/> }
              ].map(item => (
                <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold italic transition-all text-sm ${vistaActual === item.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}>
                    {item.icon} {item.label}
                </button>
              ))}
            </nav>
            <button onClick={() => supabase.auth.signOut()} className="text-red-900/70 p-4 font-black italic hover:text-red-500 transition-colors uppercase text-xs tracking-widest shrink-0">Salir</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-[#080811]">
        
        {/* BOTÓN COLAPSAR SIDEBAR */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="absolute top-8 left-8 z-20 text-slate-700 hover:text-white transition-colors"
        >
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
        </button>

        {vistaActual === 'dashboard' && (
          <div className="p-10 pl-20 animate-in fade-in">
             <header className="mb-10 pt-2 flex justify-between items-center">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Dashboard</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-xl shadow-black/30 transition-all"><PlusCircle size={16}/> Registro</button>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem]">
                   <div className="h-48"><ResponsiveContainer><AreaChart data={ventasHistoricas.slice(0,10).reverse()}><Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={0.05} fill="#3b82f6" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] border-l-4 border-l-emerald-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic mb-1">Caja Total</p>
                    <h4 className="text-3xl font-black text-emerald-400 italic">S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}</h4>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] border-l-4 border-l-red-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic mb-1">Morosos</p>
                    <h4 className="text-3xl font-black text-red-500 italic">{registros.filter(r => esAtrasado(r.fecha_vencimiento)).length} Clientes</h4>
                  </div>
                </div>
             </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
           <div className="p-10 pl-20 animate-in fade-in">
              <header className="flex justify-between items-center mb-10 pt-2"><h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2><div className="relative w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18}/><input type="text" placeholder="Filtrar por nombre..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-12 text-sm text-white font-bold italic outline-none focus:border-blue-600 transition-all" onChange={(e) => setFiltro(e.target.value)} /></div></header>
              
              {/* --- LISTA DE CLIENTES ESTILO GRID "BURBUJAS" (3 POR LÍNEA) --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] relative group hover:border-blue-600 transition-all shadow-xl shadow-black/10 overflow-hidden flex flex-col gap-4">
                    
                    {/* INFO PRINCIPAL */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-slate-200 italic text-xl uppercase tracking-tighter">{item.nombre_negocio}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest">{item.servicio}</div>
                        </div>
                        <div className="font-black text-lg text-white">S/. {item.monto?.toFixed(2)}</div>
                    </div>

                    {/* FECHA Y ESTADO */}
                    <div className="mt-auto border-t border-slate-900 pt-5 flex items-center justify-between">
                       <div className={`flex items-center gap-2 text-xs font-black uppercase italic ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500' : 'text-emerald-500'}`}>
                         <Calendar size={14}/> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                         {esAtrasado(item.fecha_vencimiento) && <span className="animate-pulse ml-2 font-black">[DEUDA]</span>}
                       </div>
                    </div>

                    {/* --- BOTONES DE ACCIÓN FLOTANTES (SOLO APARECEN AL PASAR EL MOUSE) --- */}
                    <div className="absolute top-4 right-4 space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 p-1.5 rounded-full backdrop-blur-sm">
                        <button onClick={() => handleRenovacion(item)} title="Renovar 30 días" className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={14}/></button>
                        <button onClick={() => enviarRecordatorio(item)} title="WhatsApp" className="p-2.5 bg-blue-500/10 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"><MessageCircle size={14}/></button>
                        <button onClick={() => {setEditId(item.id); setNombre(item.nombre_negocio); setWhatsapp(item.whatsapp); setServicio(item.servicio); setMonto(item.monto); setVencimiento(item.fecha_vencimiento); setIsModalOpen(true);}} className="p-2.5 bg-slate-800 text-slate-400 rounded-full hover:bg-white hover:text-black transition-all"><Edit3 size={14}/></button>
                    </div>

                  </div>
                ))}
              </div>
           </div>
        )}

        {vistaActual === 'ventas' && (
          <div className="p-10 pl-20 animate-in fade-in">
            <h2 className="text-4xl font-black text-white italic uppercase mb-10 tracking-tighter pt-2">Ventas</h2>
            <div className="space-y-3">
              {ventasHistoricas.map(v => (
                <div key={v.id} className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex justify-between items-center hover:border-blue-500/20 transition-all text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-600 font-bold italic">{new Date(v.fecha_pago).toLocaleDateString()}</div>
                    <h4 className="font-bold italic text-white uppercase">{v.proveedores?.nombre_negocio || 'Cliente'}</h4>
                    <div className="text-[10px] bg-slate-900 px-3 py-1 rounded-full text-slate-500 uppercase">{v.metodo_pago}</div>
                  </div>
                  <div className="text-xl font-black italic text-emerald-400">S/. {v.monto?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL REGISTRO (SIN CAMBIOS) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in zoom-in duration-300">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl flex flex-col gap-8">
            <div className="flex justify-between items-center"><h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar' : 'Nuevo'}</h3><button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-4">
              <input required value={nombre} onChange={e => setNombre(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="Nombre" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="WhatsApp (Ej: 519...)" />
              <select required value={servicio} onChange={e => setServicio(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-600 text-sm">
                <option value="">Servicio...</option><option value="Netflix">Netflix</option><option value="Disney+">Disney+</option><option value="Spotify">Spotify</option><option value="HBO Max">HBO Max</option>
              </select>
              <input required type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" placeholder="Monto S/." />
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block italic tracking-widest">Fecha Vencimiento</label>
                <input required type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-slate-500 font-bold text-sm" />
              </div>
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase mt-4 italic shadow-lg shadow-blue-900/40">Guardar Registro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;