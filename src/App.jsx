import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, AlertCircle, Search, TrendingUp, 
  Package, Edit3, Trash2, Key, Mail, MessageCircle, Settings, Calendar, RefreshCw, TrendingDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';

// --- VISTA DE ACCESO (ESTO CORRIGE EL ERROR DE AUTH STATUS) ---
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
          <p className="text-slate-500 text-center text-[10px] font-bold mb-8 uppercase tracking-widest italic">Fintech Edition v2.1</p>
          <div className="space-y-4">
            <input type="email" placeholder="Correo" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20">{loading ? 'Procesando...' : 'ENTRAR'}</button>
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
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Estados Formulario Inventario (Gastos)
  const [invServicio, setInvServicio] = useState('');
  const [invCorreo, setInvCorreo] = useState('');
  const [invPass, setInvPass] = useState('');
  const [invPerfiles, setInvPerfiles] = useState('');
  const [invCosto, setInvCosto] = useState('');

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

  const ingresosTotales = ventasHistoricas.reduce((acc, v) => acc + (v.monto || 0), 0);
  const gastosTotales = inventario.reduce((acc, i) => acc + (i.costo_total || 0), 0);
  const utilidadNeta = ingresosTotales - gastosTotales;

  const handleGuardarInventario = async (e) => {
    e.preventDefault();
    await supabase.from('inventario').insert([{
      servicio: invServicio, correo: invCorreo, password: invPass,
      perfiles_libres: invPerfiles, costo_total: parseFloat(invCosto), user_id: session.user.id
    }]);
    setIsInvModalOpen(false);
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
    const msj = encodeURIComponent(`Hola ${cliente.nombre_negocio}, tu servicio venció el ${new Date(cliente.fecha_vencimiento).toLocaleDateString()}. ¿Deseas renovar?`);
    window.open(`https://wa.me/${cliente.whatsapp}?text=${msj}`, '_blank');
  };

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
            { id: 'inventario', label: 'Stock/Inversión', icon: <Package size={20}/> },
            { id: 'ventas', label: 'Finanzas', icon: <DollarSign size={20}/> }
          ].map(item => (
            <button key={item.id} onClick={() => setVistaActual(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black italic transition-all ${vistaActual === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-600 hover:text-slate-300'}`}>{item.icon} {item.label}</button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-red-900/50 p-4 font-black italic hover:text-red-500 transition-colors uppercase text-xs tracking-widest mt-auto">Salir</button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {vistaActual === 'dashboard' && (
          <div className="p-10 animate-in fade-in">
             <header className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Balance Real</h2>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] border-l-4 border-l-blue-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic">Ingresos Brutos</p>
                    <h4 className="text-3xl font-black text-white italic">S/. {ingresosTotales.toFixed(2)}</h4>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] border-l-4 border-l-red-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic">Gasto en Stock</p>
                    <h4 className="text-3xl font-black text-red-500 italic">S/. {gastosTotales.toFixed(2)}</h4>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-7 rounded-[2.5rem] border-l-4 border-l-emerald-500 shadow-2xl shadow-emerald-500/10">
                    <p className="text-slate-500 text-[10px] font-black uppercase italic">Utilidad Neta</p>
                    <h4 className="text-4xl font-black text-emerald-400 italic">S/. {utilidadNeta.toFixed(2)}</h4>
                </div>
             </div>
             <div className="bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem]">
                <h3 className="text-xs font-black text-slate-500 uppercase mb-6 italic">Rendimiento Mensual</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ventasHistoricas.slice(0,15).reverse()}>
                      <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '15px'}} />
                      <Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
           <div className="p-10 animate-in fade-in">
              <header className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Gestión</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl hover:bg-blue-600 hover:text-white transition-all"><PlusCircle size={20}/> Nuevo Registro</button>
              </header>
              <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-900">
                    {registros.map(item => (
                      <tr key={item.id} className="hover:bg-blue-600/[0.02] group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-200 italic text-lg uppercase tracking-tight">{item.nombre_negocio}</div>
                          <div className="text-[10px] font-black text-blue-500 uppercase italic">{item.servicio}</div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`flex items-center gap-2 text-xs font-black uppercase italic ${esAtrasado(item.fecha_vencimiento) ? 'text-red-500' : 'text-emerald-500'}`}>
                             <Calendar size={14}/> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                             {esAtrasado(item.fecha_vencimiento) && <span className="animate-pulse ml-2 font-black">[DEUDA]</span>}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => handleRenovacion(item)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><RefreshCw size={18}/></button>
                          <button onClick={() => enviarRecordatorio(item)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><MessageCircle size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}

        {vistaActual === 'inventario' && (
          <div className="p-10 animate-in fade-in">
            <header className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black text-white italic uppercase">Inversión</h2>
              <button onClick={() => setIsInvModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black italic uppercase text-xs">+ Invertir en Cuenta</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inventario.map(item => (
                <div key={item.id} className="bg-slate-950 border border-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black italic text-white uppercase">{item.servicio}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-1 font-mono">📧 {item.correo}</p>
                  <p className="text-xs text-slate-500 mb-4 font-mono">🔑 {item.password}</p>
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                     <p className="text-blue-500 font-black italic uppercase text-[10px]">Perfiles: {item.perfiles_libres}</p>
                     <p className="text-red-500 font-black italic uppercase text-[10px]">Costo: S/. {item.costo_total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL INVENTARIO */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-slate-950 border border-slate-800 p-10 rounded-[3rem] w-full max-w-lg">
            <h3 className="text-2xl font-black italic text-white uppercase mb-6 tracking-tighter">Registrar Gasto</h3>
            <form onSubmit={handleGuardarInventario} className="space-y-4">
              <input required placeholder="Ej: Netflix 4K" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invServicio} onChange={e => setInvServicio(e.target.value)} />
              <input required placeholder="Correo de compra" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invCorreo} onChange={e => setInvCorreo(e.target.value)} />
              <input required placeholder="Clave" className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invPass} onChange={e => setInvPass(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Cant. Perfiles" className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invPerfiles} onChange={e => setInvPerfiles(e.target.value)} />
                <input required type="number" step="0.01" placeholder="Costo S/." className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-bold" value={invCosto} onChange={e => setInvCosto(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic shadow-lg shadow-blue-900/40">Guardar Inversión</button>
              <button onClick={() => setIsInvModalOpen(false)} className="w-full text-slate-600 font-bold uppercase text-xs tracking-widest mt-2">Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;