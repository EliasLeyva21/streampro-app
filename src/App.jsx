import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, TrendingUp, 
  Package, Edit3, Trash2, Key, Mail, MessageCircle, Settings, Calendar, RefreshCw
} from 'lucide-center';
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <form onSubmit={handleLogin} className="bg-slate-950 p-10 rounded-[3rem] border border-slate-900 shadow-2xl mb-6">
          <div className="flex justify-center mb-6 text-blue-500">
             <div className="bg-blue-600/10 p-4 rounded-2xl"><Monitor size={40} /></div>
          </div>
          <h2 className="text-4xl font-black text-white italic mb-1 text-center uppercase tracking-tighter">ZERO</h2>
          <p className="text-slate-500 text-center text-[10px] font-bold mb-8 uppercase tracking-widest italic">Management System</p>
          <div className="space-y-4">
            <input type="email" placeholder="Correo electrónico" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50">{loading ? 'Cargando...' : 'Entrar'}</button>
          </div>
        </form>
        <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-[2rem] text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic mb-2">Soporte Técnico</p>
          <a href="https://wa.me/51902257451" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-500 font-black uppercase text-[10px] hover:text-blue-400 transition-colors underline underline-offset-4 decoration-blue-500/20"><MessageCircle size={14} /> Contactar con la central</a>
        </div>
      </div>
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
    fetchInventario(uId);
    fetchVentas(uId);
  };

  const fetchRegistros = async (uId) => {
    const { data } = await supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true });
    if (data) setRegistros(data);
  };

  const fetchInventario = async (uId) => {
    const { data } = await supabase.from('inventario').select('*').eq('user_id', uId);
    if (data) setInventario(data);
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
        await supabase.from('ventas').insert([{
          cliente_id: data[0].id,
          monto: parseFloat(monto),
          metodo_pago: 'Registro Inicial',
          user_id: session.user.id
        }]);
      }
    }
    cerrarModal(); 
    cargarTodo(session.user.id);
  };

  // FUNCIÓN DE RENOVACIÓN (SUMA 30 DÍAS)
  const handleRenovacion = async (cliente) => {
    const confirmar = window.confirm(`¿Renovar suscripción de ${cliente.nombre_negocio} por 30 días?`);
    if (!confirmar) return;

    const fechaBase = new Date(cliente.fecha_vencimiento);
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(nuevaFecha.getDate() + 30);
    const fechaISO = nuevaFecha.toISOString().split('T')[0];

    await supabase.from('proveedores').update({ fecha_vencimiento: fechaISO }).eq('id', cliente.id);
    await supabase.from('ventas').insert([{
      cliente_id: cliente.id,
      monto: cliente.monto,
      metodo_pago: 'Renovación Rápida',
      user_id: session.user.id
    }]);

    alert("Renovación procesada con éxito.");
    cargarTodo(session.user.id);
  };

  // FUNCIÓN WHATSAPP
  const enviarRecordatorio = (cliente) => {
    const msj = encodeURIComponent(`Hola ${cliente.nombre_negocio}, te recordamos que tu servicio de ${cliente.servicio} venció el ${new Date(cliente.fecha_vencimiento).toLocaleDateString()}. Quedamos atentos para tu renovación.`);
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
    <div className="min-h-screen bg-black text-slate-300 flex font-sans">
      <aside className="w-72 bg-slate-950 border-r border-slate-900 p-8 flex flex-col gap-10">
        <h1 className="text-3xl font-black text-blue-500 italic flex items-center gap-3 tracking-tighter"><Monitor size={28}/> ZERO</h1>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20}/> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={20}/> },
            { id: 'inventario', label: 'Inventario', icon: <Package size={20}/> },
            { id: 'ventas', label: 'Ventas', icon: <DollarSign size={20}/> },
            { id: 'config', label: 'Ajustes', icon: <Settings size={20}/> }
          ].map(item => (
            <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black italic transition-all ${vistaActual === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-600 hover:text-slate-300'}`}>{item.icon} {item.label}</button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-red-900/50 p-4 font-black italic hover:text-red-500 transition-colors"><LogOut size={22}/> SALIR</button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {vistaActual === 'dashboard' && (
          <div className="p-10 animate-in fade-in">
             <header className="flex justify-between items-end mb-10">
                <div><h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Dashboard</h2></div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl transition-all"><PlusCircle size={20}/> Nuevo Cliente</button>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem]">
                   <h3 className="text-[10px] font-black text-slate-600 uppercase mb-6 italic flex items-center gap-2"><TrendingUp size={14}/> Historial Financiero (S/.)</h3>
                   <div className="h-48">
                     <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={ventasHistoricas.slice(0, 15).reverse()}>
                         <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '15px'}} />
                         <Area type="monotone" dataKey="monto" stroke="#3b82f6" strokeWidth={4} fill="rgba(59, 130, 246, 0.05)" />
                       </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] flex items-center justify-between border-l-4 border-l-emerald-500 shadow-2xl shadow-emerald-500/5">
                    <div><p className="text-slate-500 text-[10px] font-black uppercase italic">Ingresos Totales</p><h4 className="text-3xl font-black text-emerald-400 italic">S/. {ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0).toFixed(2)}</h4></div>
                    <DollarSign className="text-emerald-900" size={32}/>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] flex items-center justify-between border-l-4 border-l-red-500">
                    <div><p className="text-slate-500 text-[10px] font-black uppercase italic">Pagos Atrasados</p><h4 className="text-3xl font-black text-red-500 italic">{registros.filter(r => esAtrasado(r.fecha_vencimiento)).length} Deudores</h4></div>
                    <AlertCircle className="text-red-900" size={32}/>
                  </div>
                </div>
             </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
           <div className="p-10 animate-in fade-in">
              <header className="flex justify-between items-center mb-10"><h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2><div className="relative w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18}/><input type="text" placeholder="Filtrar..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-12 text-sm text-white outline-none focus:border-blue-600 font-bold italic" onChange={(e) => setFiltro(e.target.value)} /></div></header>
              <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-900">
                    {registros.filter(r => r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-blue-600/[0.02] group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-200 italic text-lg">{item.nombre_negocio}</div>
                          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.servicio}</div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`flex items-center gap-2 text-xs font-black uppercase italic ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500' : 'text-emerald-500'}`}>
                             <Calendar size={14}/> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                             {esAtrasado(item.fecha_vencimiento) && <span className="animate-pulse ml-2">[DEUDA]</span>}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => handleRenovacion(item)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={18}/></button>
                          <button onClick={() => enviarRecordatorio(item)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><MessageCircle size={18}/></button>
                          <button onClick={() => {setEditId(item.id); setNombre(item.nombre_negocio); setWhatsapp(item.whatsapp); setServicio(item.servicio); setMonto(item.monto); setVencimiento(item.fecha_vencimiento); setIsModalOpen(true);}} className="p-3 bg-slate-900 text-slate-400 rounded-xl hover:bg-white hover:text-black transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => eliminarRegistro(item.id)} className="p-3 bg-slate-900 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}

        {/* VISTAS RESTANTES (STOCK, VENTAS, CONFIG) SIMILARES A VERSIONES ANTERIORES... */}
      </main>

      {/* MODAL DE CLIENTES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in zoom-in duration-300">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar' : 'Nuevo'}</h3><button onClick={cerrarModal} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-2 gap-4">
              <input required value={nombre} onChange={e => setNombre(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Nombre" />
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="col-span-2 bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="WhatsApp (Ej: 519...)" />
              <select required value={servicio} onChange={e => setServicio(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600">
                <option value="">Servicio...</option>
                <option value="Netflix">Netflix</option>
                <option value="Disney+">Disney+</option>
                <option value="Spotify">Spotify</option>
              </select>
              <input required type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} className="bg-black border border-slate-800 rounded-2xl p-4 text-white italic font-bold outline-none focus:border-blue-600" placeholder="Monto S/." />
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block italic tracking-widest">Fecha Vencimiento</label>
                <input required type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-slate-500 font-bold outline-none focus:border-blue-600" />
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