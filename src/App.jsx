import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { 
  LayoutDashboard, PlusCircle, X, LogOut, Monitor, 
  Users, DollarSign, Search, Package, Edit3, Trash2, 
  Key, Mail, MessageCircle, Settings, RefreshCw, 
  PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Save, Clock, Calendar, TrendingUp, Copy, ShieldAlert, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// --- LISTA DE SERVICIOS PREDEFINIDOS ---
const SERVICIOS_PREDEFINIDOS = [
  'Netflix', 'Disney+', 'Spotify', 'YouTube', 'Magis TV', 
  'Amazon Prime', 'HBO Max', 'Crunchyroll', 'Vix+', 'IPTV', 'Paramount'
];

const ADMIN_EMAIL = 'forex3339@gmail.com'; // Correo del dueño del SaaS

// --- VISTA: LOGIN ---
function AuthView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error de acceso: " + error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 md:p-6 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-blue-600/10 blur-[100px] md:blur-[120px] rounded-full"></div>
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/[0.02] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-6 bg-white rounded-3xl p-3 md:p-4 shadow-2xl flex items-center justify-center">
            <img src="https://nzsxqmkhbzwpxjwwysnq.supabase.co/storage/v1/object/public/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic mb-1 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 uppercase tracking-tighter">ZERO</h2>
          <p className="text-blue-400/50 text-[9px] md:text-[10px] font-black mb-8 md:mb-10 uppercase tracking-[0.3em] italic">Intelligence Management</p>
          
          <form onSubmit={handleLogin} className="space-y-4 w-full mb-6">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm md:text-base text-white outline-none focus:border-blue-500/50 transition-all font-bold" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm md:text-base text-white outline-none focus:border-blue-500/50 transition-all font-bold" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl active:scale-95 mt-2 text-sm"
            >
              {loading ? 'INICIANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="mt-2 pt-6 border-t border-white/5 w-full">
            <p className="text-slate-500 text-[10px] md:text-[11px] font-bold tracking-widest uppercase mb-2">¿No tienes cuenta?</p>
            <a 
              href="https://wa.me/51902257451?text=Hola,%20deseo%20adquirir%20un%20plan%20mensual%20del%20sistema%20ZERO." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-white transition-colors text-[10px] md:text-xs font-black italic uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} /> Adquiere tu plan mensual
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VISTA: SUSPENSIÓN DE PAGO ---
function SuspendedView({ onLogout }) {
  return (
    <div className="min-h-screen bg-[#050509] flex flex-col items-center justify-center p-4 text-center text-white">
      <div className="bg-red-500/10 border border-red-500/20 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] max-w-lg shadow-[0_0_50px_rgba(239,68,68,0.1)] animate-in fade-in zoom-in duration-500">
        <AlertOctagon size={60} className="text-red-500 mx-auto mb-6 md:mb-8 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-black italic mb-4 uppercase tracking-tighter text-white">Servicio Suspendido</h2>
        <p className="text-slate-400 font-bold mb-8 text-xs md:text-sm">El acceso a tu panel CRM ha sido restringido por falta de pago. Toda tu información está segura y guardada.</p>
        <a 
          href="https://wa.me/51902257451?text=Hola,%20deseo%20renovar%20mi%20suscripción%20al%20sistema%20ZERO%20para%20desbloquear%20mi%20panel." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full block bg-emerald-600 hover:bg-emerald-500 text-white py-4 md:py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl mb-4 text-xs md:text-sm"
        >
          Contactar Soporte / Pagar
        </a>
        <button 
          onClick={onLogout} 
          className="text-slate-500 hover:text-white font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 w-full mt-6"
        >
          <LogOut size={14}/> Salir de la cuenta
        </button>
      </div>
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL ---
function App() {
  const [session, setSession] = useState(null);
  const [systemUser, setSystemUser] = useState(null);
  const [isLoadingSaaS, setIsLoadingSaaS] = useState(true);
  const [listaUsuariosSaaS, setListaUsuariosSaaS] = useState([]);

  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  
  const [registros, setRegistros] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [plataformaFiltro, setPlataformaFiltro] = useState('Todas');
  const [mesFiltroFinanzas, setMesFiltroFinanzas] = useState('Todos');

  const [userName, setUserName] = useState(() => localStorage.getItem('zero_user_name') || 'ADMIN ZERO');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', whatsapp: '', servicio: '', customServicio: '', monto: '', vencimiento: '' });
  
  const [editInvId, setEditInvId] = useState(null);
  const [invForm, setInvForm] = useState({ 
    servicio: '', customServicio: '', correo: '', contrasena: '', 
    proveedor_nombre: '', proveedor_whatsapp: '', costo: '', vencimiento: '' 
  });

  const handleNavClick = (id) => {
    setVistaActual(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // --- LÓGICA CORE SAAS (Seguridad y Suscripciones) ---
  const verificarSuscripcionSaaS = useCallback(async (user) => {
    try {
      let { data } = await supabase.from('usuarios_sistema').select('*').eq('user_id', user.id).single();
      
      if (!data) {
        const isAdmin = user.email === ADMIN_EMAIL;
        const newProfile = { 
          user_id: user.id, 
          email: user.email, 
          rol: isAdmin ? 'admin' : 'cliente', 
          estado: 'activo' 
        };
        await supabase.from('usuarios_sistema').insert([newProfile]);
        data = newProfile;
      }
      
      setSystemUser(data);
      if (data.estado === 'activo' || data.rol === 'admin') {
        cargarTodo(user.id);
        if (data.rol === 'admin') cargarUsuariosSaaS();
      }
    } catch (error) {
      console.error("Error validando SaaS:", error);
    }
    setIsLoadingSaaS(false); 
  }, []);

  const cargarUsuariosSaaS = async () => {
    const { data } = await supabase.from('usuarios_sistema').select('*');
    if (data) setListaUsuariosSaaS(data);
  };

  const modificarEstadoSaaS = async (userId, nuevoEstado) => {
    await supabase.from('usuarios_sistema').update({ estado: nuevoEstado }).eq('user_id', userId);
    cargarUsuariosSaaS();
  };

  const renovarSuscripcionCRM = async (userId, diasExtra = 30) => {
    const { data: usuario } = await supabase.from('usuarios_sistema').select('vencimiento_crm').eq('user_id', userId).single();
    let baseDate = new Date();
    if (usuario?.vencimiento_crm && new Date(usuario.vencimiento_crm) > baseDate) { 
      baseDate = new Date(usuario.vencimiento_crm); 
    }
    baseDate.setDate(baseDate.getDate() + diasExtra);
    
    await supabase.from('usuarios_sistema').update({ 
      vencimiento_crm: baseDate.toISOString().split('T')[0], 
      estado: 'activo' 
    }).eq('user_id', userId);
    
    cargarUsuariosSaaS();
  };

  // --- LÓGICA DEL CRM (Carga de datos del cliente) ---
  const cargarTodo = useCallback(async (uId) => {
    try {
      const [reg, vnt, inv] = await Promise.all([
        supabase.from('proveedores').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true }),
        supabase.from('ventas').select('*, proveedores(nombre_negocio, servicio)').eq('user_id', uId).order('fecha_pago', { ascending: false }),
        supabase.from('inventario').select('*').eq('user_id', uId).order('fecha_vencimiento', { ascending: true })
      ]);
      if (reg.data) setRegistros(reg.data);
      if (vnt.data) setVentasHistoricas(vnt.data);
      if (inv.data) setInventario(inv.data);
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  }, []);

  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 1024);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) verificarSuscripcionSaaS(session.user);
      else setIsLoadingSaaS(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        verificarSuscripcionSaaS(session.user);
      } else {
        setIsLoadingSaaS(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [verificarSuscripcionSaaS]);

  // --- VARIABLES FINANCIERAS Y FILTROS (USE MEMO) ---
  const finanzasUnificadas = useMemo(() => {
    const ingresos = ventasHistoricas.map(v => ({ 
      id: `v-${v.id}`, 
      tipo: 'ingreso', 
      fecha: v.fecha_pago || v.created_at || new Date().toISOString(), 
      titulo: v.proveedores?.nombre_negocio || 'Venta Rápida', 
      servicio: v.proveedores?.servicio || 'Varios', 
      monto: v.monto || 0 
    }));
    
    const gastos = inventario.map(i => ({ 
      id: `i-${i.id}`, 
      tipo: 'gasto', 
      // CORRECCIÓN: Ahora usa estrictamente la fecha de creación, nunca la de vencimiento.
      fecha: i.created_at || new Date().toISOString(), 
      titulo: i.proveedor_nombre ? `Prov: ${i.proveedor_nombre}` : 'Compra Stock', 
      servicio: i.servicio || 'Varios', 
      monto: i.costo_total || 0 
    }));
    
    return [...ingresos, ...gastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [ventasHistoricas, inventario]);

  const mesesDisponibles = useMemo(() => {
    const meses = finanzasUnificadas.map(item => {
      const d = new Date(item.fecha); 
      return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    });
    return ['Todos', ...new Set(meses)];
  }, [finanzasUnificadas]);

  const finanzasFiltradas = useMemo(() => {
    if (mesFiltroFinanzas === 'Todos') return finanzasUnificadas;
    return finanzasUnificadas.filter(item => {
      const d = new Date(item.fecha); 
      const nombreMes = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
      return nombreMes === mesFiltroFinanzas;
    });
  }, [finanzasUnificadas, mesFiltroFinanzas]);

  // --- FUNCIONES CRM ---
  const calcularDiasRestantes = (fecha) => {
    if (!fecha) return 0;
    const hoy = new Date(); 
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fecha); 
    vencimiento.setHours(0, 0, 0, 0);
    return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  };

  const enviarWhatsApp = (cliente) => {
    const dias = calcularDiasRestantes(cliente.fecha_vencimiento);
    let estadoMsg = dias === 0 ? "vence hoy" : dias > 0 ? `vence en ${dias} días` : `venció hace ${Math.abs(dias)} días`;
    const mensaje = `*ZERO - RECORDATORIO DE PAGO*%0A%0A` +
                    `Hola *${cliente.nombre_negocio}*, te recordamos que tu servicio de *${cliente.servicio}* ${estadoMsg} (*${new Date(cliente.fecha_vencimiento).toLocaleDateString()}*).%0A%0A` +
                    `*Monto a renovar:* S/. ${cliente.monto.toFixed(2)}%0A%0A` +
                    `Por favor, envíanos el comprobante para asegurar la continuidad de tu servicio. ¡Gracias!`;
    window.open(`https://wa.me/${cliente.whatsapp}?text=${mensaje}`, '_blank');
  };

  const enviarWhatsAppProveedor = (item) => {
    if (!item.proveedor_whatsapp) {
      alert("No has registrado el WhatsApp de este proveedor.");
      return;
    }
    const mensaje = `Hola ${item.proveedor_nombre || 'proveedor'}, me comunico para gestionar la cuenta de *${item.servicio}* (${item.correo}).`;
    window.open(`https://wa.me/${item.proveedor_whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const copiarAlPortapapeles = (texto) => { 
    navigator.clipboard.writeText(texto); 
    alert("¡Copiado al portapapeles!"); 
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    const servicioFinal = form.servicio === 'Otros' ? form.customServicio : form.servicio;
    const payload = { 
      nombre_negocio: form.nombre, 
      whatsapp: form.whatsapp, 
      servicio: servicioFinal, 
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
    
    if (result.error) {
      alert(result.error.message); 
    } else { 
      setIsModalOpen(false); 
      cargarTodo(session.user.id); 
    }
  };

  const handleRenovacion = async (c) => {
    const f = new Date(c.fecha_vencimiento); 
    f.setMonth(f.getMonth() + 1);
    
    const { error } = await supabase.from('proveedores').update({ 
      fecha_vencimiento: f.toISOString().split('T')[0] 
    }).eq('id', c.id);
    
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

  // NUEVO: Función para renovar el Stock (Cuentas Maestras)
  const handleRenovacionStock = async (i) => {
    if(!i.fecha_vencimiento) return alert("Esta cuenta no tiene fecha de vencimiento asignada.");
    const f = new Date(i.fecha_vencimiento);
    f.setMonth(f.getMonth() + 1);
    
    const { error } = await supabase.from('inventario').update({ 
      fecha_vencimiento: f.toISOString().split('T')[0] 
    }).eq('id', i.id);
    
    if (error) {
      alert(error.message);
    } else {
      cargarTodo(session.user.id);
    }
  };

  const handleGuardarStock = async (e) => {
    e.preventDefault();
    const servicioFinal = invForm.servicio === 'Otros' ? invForm.customServicio : invForm.servicio;
    const payload = { 
      servicio: servicioFinal, 
      correo: invForm.correo, 
      contrasena: invForm.contrasena, 
      proveedor_nombre: invForm.proveedor_nombre || null, 
      proveedor_whatsapp: invForm.proveedor_whatsapp || null, 
      costo_total: invForm.costo ? parseFloat(invForm.costo) : null, 
      fecha_vencimiento: invForm.vencimiento, 
      user_id: session.user.id 
    };
    
    let result = editInvId 
      ? await supabase.from('inventario').update(payload).eq('id', editInvId) 
      : await supabase.from('inventario').insert([payload]);
    
    if (result.error) {
      alert("Error al guardar: " + result.error.message); 
    } else { 
      setIsInvModalOpen(false); 
      cargarTodo(session.user.id); 
    }
  };

  const abrirEdicion = (c) => { 
    const isPredefinido = SERVICIOS_PREDEFINIDOS.includes(c.servicio);
    setEditId(c.id); 
    setForm({ 
      nombre: c.nombre_negocio, 
      whatsapp: c.whatsapp, 
      servicio: isPredefinido ? c.servicio : 'Otros', 
      customServicio: isPredefinido ? '' : c.servicio, 
      monto: c.monto, 
      vencimiento: c.fecha_vencimiento 
    }); 
    setIsModalOpen(true); 
  };
  
  const abrirEdicionStock = (i) => {
    const isPredefinido = SERVICIOS_PREDEFINIDOS.includes(i.servicio);
    setEditInvId(i.id); 
    setInvForm({ 
      servicio: isPredefinido ? i.servicio : 'Otros', 
      customServicio: isPredefinido ? '' : i.servicio, 
      correo: i.correo || '', 
      contrasena: i.contrasena || '', 
      proveedor_nombre: i.proveedor_nombre || '', 
      proveedor_whatsapp: i.proveedor_whatsapp || '', 
      costo: i.costo_total || '', 
      vencimiento: i.fecha_vencimiento || '' 
    }); 
    setIsInvModalOpen(true);
  };

  const cerrarModal = () => { 
    setIsModalOpen(false); 
    setEditId(null); 
    setForm({ nombre: '', whatsapp: '', servicio: '', customServicio: '', monto: '', vencimiento: '' }); 
  };

  const cerrarInvModal = () => { 
    setIsInvModalOpen(false); 
    setEditInvId(null); 
    setInvForm({ servicio: '', customServicio: '', correo: '', contrasena: '', proveedor_nombre: '', proveedor_whatsapp: '', costo: '', vencimiento: '' }); 
  };

  const handleGuardarNombre = () => { 
    localStorage.setItem('zero_user_name', userName); 
    alert("¡Actualizado!"); 
  };

  const handleActualizarPassword = async () => {
    if (newPassword.length < 6) return alert("Mínimo 6 caracteres.");
    setUpdatingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert("Error: " + error.message); 
    else { 
      alert("¡Éxito!"); 
      setNewPassword(''); 
    }
    setUpdatingPass(false);
  };

  // --- RENDERS DE SEGURIDAD ---
  if (!session) return <AuthView />;
  if (isLoadingSaaS) return <div className="min-h-screen bg-[#050509] flex items-center justify-center text-white font-black italic text-2xl animate-pulse">VERIFICANDO LICENCIA...</div>;
  if (systemUser?.estado === 'suspendido' && systemUser?.rol !== 'admin') return <SuspendedView onLogout={() => supabase.auth.signOut()} />;

  const registrosFiltrados = registros.filter(r => {
    const cumpleTexto = r.nombre_negocio.toLowerCase().includes(filtro.toLowerCase()) || r.fecha_vencimiento.includes(filtro);
    const cumplePlataforma = plataformaFiltro === 'Todas' || (plataformaFiltro === 'Otros' ? !SERVICIOS_PREDEFINIDOS.includes(r.servicio) : r.servicio === plataformaFiltro);
    return cumpleTexto && cumplePlataforma;
  });

  const totalVentas = ventasHistoricas.reduce((acc, c) => acc + (c.monto || 0), 0);
  const totalInversion = inventario.reduce((acc, i) => acc + (i.costo_total || 0), 0);
  const utilidadNeta = totalVentas - totalInversion;
  const clientesUrgentes = registros.filter(r => calcularDiasRestantes(r.fecha_vencimiento) <= 3).length;

  return (
    <div className="min-h-screen bg-[#050509] text-slate-300 flex font-sans overflow-x-hidden select-none">
      
      {/* INYECCIÓN DE CSS PARA SCROLLBAR OSCURA */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>

      {/* OVERLAY PARA MÓVIL */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* SIDEBAR RESPONSIVO */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#050509]/95 lg:bg-black/20 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:w-0 lg:opacity-0 lg:overflow-hidden'}`}>
        <div className="p-8 lg:p-10 flex flex-col h-full custom-scrollbar overflow-y-auto">
            <div className="flex items-center gap-4 mb-10 lg:mb-12 px-2 text-white italic font-black text-2xl tracking-tighter">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Monitor size={20}/>
                </div>
                ZERO
            </div>
            
            <nav className="flex-1 space-y-3">
              {[
                { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20}/> },
                { id: 'clientes', label: 'Clientes', icon: <Users size={20}/> },
                { id: 'stock', label: 'Stock', icon: <Package size={20}/> },
                { id: 'finanzas', label: 'Finanzas', icon: <DollarSign size={20}/> },
                { id: 'ajustes', label: 'Ajustes', icon: <Settings size={20}/> }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => handleNavClick(item.id)} 
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all text-[13px] ${vistaActual === item.id ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white'}`}
                >
                    {item.icon} {item.label}
                </button>
              ))}

              {systemUser?.rol === 'admin' && (
                <button 
                  onClick={() => handleNavClick('saas_admin')} 
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all text-[13px] mt-8 border ${vistaActual === 'saas_admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'border-dashed border-amber-500/30 text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10'}`}
                >
                  <ShieldAlert size={20}/> 👑 Panel SaaS
                </button>
              )}
            </nav>
            
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="mt-auto pt-8 flex items-center gap-3 p-4 text-slate-600 hover:text-red-400 font-bold transition-all text-xs uppercase tracking-widest"
            >
                <LogOut size={16}/> Salir
            </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto px-5 py-8 lg:px-12 lg:py-10 relative bg-[#080811] custom-scrollbar w-full">
        
        {/* BOTÓN FLOTANTE MÁGICO (Responsive) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className={`fixed z-[60] transition-all shadow-2xl backdrop-blur-md flex items-center justify-center
            bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white border border-white/20 hover:scale-105 active:scale-95
            lg:bottom-auto lg:right-auto lg:top-14 lg:w-auto lg:h-auto lg:p-3 lg:rounded-2xl lg:bg-white/5 lg:text-slate-500 lg:border-white/10 lg:hover:text-white lg:hover:bg-white/10 lg:active:scale-100
            ${isSidebarOpen ? 'lg:left-80' : 'lg:left-10'}
          `}
        >
            <span className="lg:hidden">{isSidebarOpen ? <X size={24} /> : <PanelLeftOpen size={24} />}</span>
            <span className="hidden lg:block">{isSidebarOpen ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}</span>
        </button>

        {/* SAAS ADMIN */}
        {vistaActual === 'saas_admin' && systemUser?.rol === 'admin' && (
          <div className="animate-in fade-in duration-700 max-w-7xl mx-auto pb-20 lg:pb-0">
             <header className="mb-8 lg:mb-12 pt-2 lg:pt-4 flex items-center gap-4">
                <div className="w-0 lg:w-16"></div>
                <h2 className="text-3xl lg:text-5xl font-black text-amber-400 italic uppercase tracking-tighter">Control SaaS</h2>
             </header>
             
             <div className="bg-white/[0.02] border border-white/5 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem]">
                <h3 className="text-lg lg:text-xl font-black text-white italic uppercase tracking-widest mb-6 lg:mb-8">Tus Suscriptores</h3>
                
                <div className="space-y-4">
                  {listaUsuariosSaaS.map(user => (
                    <div key={user.user_id} className={`p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl border flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0 ${user.estado === 'activo' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                      <div>
                        <p className="font-bold text-white text-base lg:text-lg break-all">
                          {user.email} 
                          {user.rol === 'admin' && <span className="text-[9px] lg:text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full ml-2 align-middle">ADMIN</span>}
                        </p>
                        <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-slate-500 mt-2">
                          Vence: <span className={new Date(user.vencimiento_crm) < new Date() ? 'text-red-400' : 'text-emerald-400'}>{user.vencimiento_crm ? new Date(user.vencimiento_crm).toLocaleDateString() : 'Sin fecha'}</span>
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 lg:gap-4 w-full md:w-auto">
                        {user.estado === 'suspendido' ? 
                          <button onClick={() => modificarEstadoSaaS(user.user_id, 'activo')} className="flex-1 md:flex-none justify-center items-center gap-2 bg-emerald-600/20 text-emerald-400 px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase hover:bg-emerald-600/40 flex">
                            <CheckCircle2 size={16}/> Activar
                          </button> 
                          :
                          <button onClick={() => modificarEstadoSaaS(user.user_id, 'suspendido')} className="flex-1 md:flex-none justify-center items-center gap-2 bg-red-600/20 text-red-400 px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase hover:bg-red-600/40 flex">
                            <AlertOctagon size={16}/> Suspender
                          </button>
                        }
                        <button onClick={() => renovarSuscripcionCRM(user.user_id, 30)} className="flex-1 md:flex-none justify-center items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600/40 flex">
                          <Calendar size={16}/> +30 Días
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* DASHBOARD */}
        {vistaActual === 'dashboard' && (
          <div className="animate-in fade-in duration-700 max-w-7xl mx-auto pb-20 lg:pb-0">
             <header className="mb-8 lg:mb-12 pt-2 lg:pt-4 flex items-center gap-4">
                <div className="w-0 lg:w-16"></div> 
                <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Dashboard</h2>
             </header>
             
             <div className="grid grid-cols-12 gap-5 lg:gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white/[0.03] border border-white/10 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] h-[220px] lg:h-[280px]">
                   <p className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase italic mb-6 lg:mb-8 tracking-widest">Flujo de Ingresos Recientes</p>
                   <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={ventasHistoricas.slice(0,10).reverse()}>
                        <defs>
                          <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="monto" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMonto)" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderRadius: '15px', border: '1px solid #ffffff10', color: '#fff' }} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                
                <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 lg:p-6 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.05)] flex-1">
                      <div className="flex justify-between items-start mb-2"><p className="text-blue-400 text-[9px] lg:text-[10px] font-black uppercase italic tracking-widest">Ingresos Brutos</p><TrendingUp size={16} className="text-blue-400" /></div>
                      <h4 className="text-3xl lg:text-4xl font-black text-white italic">S/. {totalVentas.toFixed(2)}</h4>
                      <div className="text-[8px] lg:text-[9px] text-blue-400/50 font-bold mt-2 uppercase">Total recaudado</div>
                    </div>
                    
                    <div className="bg-violet-500/10 border border-violet-500/20 p-5 lg:p-6 rounded-3xl shadow-[0_0_20px_rgba(139,92,246,0.05)] flex-1">
                      <div className="flex justify-between items-start mb-2"><p className="text-violet-400 text-[9px] lg:text-[10px] font-black uppercase italic tracking-widest">Utilidad Neta</p><DollarSign size={16} className="text-violet-400" /></div>
                      <h4 className="text-3xl lg:text-4xl font-black text-white italic">S/. {utilidadNeta.toFixed(2)}</h4>
                      <div className="text-[8px] lg:text-[9px] text-violet-400/50 font-bold mt-2 uppercase">Ingresos - Costos de Stock</div>
                    </div>
                    
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 lg:p-6 rounded-3xl shadow-[0_0_20px_rgba(16,185,129,0.05)] flex-1">
                      <div className="flex justify-between items-start mb-2"><p className="text-emerald-400 text-[9px] lg:text-[10px] font-black uppercase italic tracking-widest">Clientes Activos</p><Users size={16} className="text-emerald-400" /></div>
                      <h4 className="text-3xl lg:text-4xl font-black text-white italic">{registros.length}</h4>
                      <div className="text-[8px] lg:text-[9px] text-emerald-400/50 font-bold mt-2 uppercase">Base de datos total</div>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 p-5 lg:p-6 rounded-3xl shadow-[0_0_20px_rgba(239,68,68,0.05)] flex-1">
                      <div className="flex justify-between items-start mb-2"><p className="text-red-400 text-[9px] lg:text-[10px] font-black uppercase italic tracking-widest">Atención Urgente</p><Clock size={16} className="text-red-400" /></div>
                      <h4 className="text-3xl lg:text-4xl font-black text-white italic">{clientesUrgentes}</h4>
                      <div className="text-[8px] lg:text-[9px] text-red-400/50 font-bold mt-2 uppercase italic">Vencidos o próximos</div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* CLIENTES / CARTERA */}
        {vistaActual === 'clientes' && (
            <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-20 lg:pb-0">
              <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 pt-2 lg:pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-0 lg:w-16"></div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Cartera</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full md:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16}/>
                    <input 
                      type="text" 
                      placeholder="Buscar cliente o fecha..." 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 md:py-4 pl-12 text-xs font-bold outline-none focus:border-white/20" 
                      onChange={(e) => setFiltro(e.target.value)} 
                    />
                  </div>
                  <button 
                    onClick={() => { 
                      setEditId(null); 
                      setForm({ nombre: '', whatsapp: '', servicio: '', customServicio: '', monto: '', vencimiento: '' }); 
                      setIsModalOpen(true); 
                    }} 
                    className="w-full sm:w-auto justify-center bg-white text-black px-6 py-3 md:py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <PlusCircle size={18}/> Nuevo
                  </button>
                </div>
              </header>

              <div className="flex gap-2 lg:gap-3 mb-8 lg:mb-10 overflow-x-auto pb-4 custom-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0">
                <div className="hidden lg:block w-16 flex-shrink-0"></div>
                {['Todas', ...SERVICIOS_PREDEFINIDOS, 'Otros'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPlataformaFiltro(p)} 
                    className={`flex-shrink-0 px-5 py-2 md:px-6 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${plataformaFiltro === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                {registrosFiltrados.map(item => {
                  const dias = calcularDiasRestantes(item.fecha_vencimiento);
                  return (
                    <div key={item.id} className="bg-white/[0.02] border border-white/5 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] hover:border-blue-500/30 transition-all group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                          <div className="pr-4">
                              <h3 className="font-black text-white italic text-xl lg:text-2xl uppercase group-hover:text-blue-400 transition-colors break-words">{item.nombre_negocio}</h3>
                              <div className="text-[9px] lg:text-[10px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{item.servicio}</div>
                          </div>
                          <span className="text-lg lg:text-xl font-black text-white whitespace-nowrap">S/. {item.monto?.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-5 lg:pt-6 mt-auto">
                         <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${dias < 0 ? 'text-red-500' : dias <= 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                              <Clock size={12}/> {new Date(item.fecha_vencimiento).toLocaleDateString()}
                            </div>
                            <div className="text-[8px] lg:text-[9px] font-bold text-slate-600 uppercase">
                              {dias === 0 ? "¡Vence hoy!" : dias > 0 ? `Faltan ${dias} días` : `Venció hace ${Math.abs(dias)} días`}
                            </div>
                         </div>
                         
                         <div className="flex gap-1 lg:gap-2">
                            <button 
                              onClick={() => enviarWhatsApp(item)} 
                              className={`p-2 transition-all drop-shadow-lg ${dias <= 0 ? 'text-red-500 animate-pulse scale-110 lg:scale-125' : 'text-emerald-400 hover:text-emerald-300 hover:scale-110 lg:hover:scale-125'}`} 
                              title="Enviar recordatorio"
                            >
                              <MessageCircle size={dias <= 0 ? 20 : 18}/>
                            </button>
                            <button onClick={() => abrirEdicion(item)} className="p-2 text-slate-500 hover:text-white transition-colors" title="Editar">
                              <Edit3 size={16}/>
                            </button>
                            <button onClick={() => handleRenovacion(item)} className="p-2 text-emerald-500 hover:scale-110 transition-all" title="Renovar">
                              <RefreshCw size={16}/>
                            </button>
                            <button onClick={() => { if(window.confirm('¿Eliminar registro?')) supabase.from('proveedores').delete().eq('id', item.id).then(() => cargarTodo(session.user.id))}} className="p-2 text-red-500/50 hover:text-red-500 transition-colors" title="Eliminar">
                              <Trash2 size={16}/>
                            </button>
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
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-20 lg:pb-0">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 lg:mb-12 pt-2 lg:pt-4">
              <div className="flex items-center gap-4">
                <div className="w-0 lg:w-16"></div>
                <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Cuentas Maestras</h2>
              </div>
              <button 
                onClick={() => { 
                  setEditInvId(null); 
                  setInvForm({ servicio: '', customServicio: '', correo: '', contrasena: '', proveedor_nombre: '', proveedor_whatsapp: '', costo: '', vencimiento: '' }); 
                  setIsInvModalOpen(true); 
                }} 
                className="w-full sm:w-auto justify-center bg-blue-600 text-white px-6 py-3 md:py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-500 transition-all"
              >
                + Nueva Cuenta
              </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {inventario.map(i => {
                  const diasInv = calcularDiasRestantes(i.fecha_vencimiento);
                  return (
                    <div key={i.id} className="bg-white/[0.02] border border-white/5 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] relative group flex flex-col h-full hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-5 lg:mb-6">
                        <div className="pr-2">
                          <h3 className="text-xl lg:text-2xl font-black text-white italic uppercase break-words">{i.servicio}</h3>
                          <p className="text-slate-500 text-[9px] lg:text-[10px] font-black uppercase italic tracking-widest mt-1">
                            {i.proveedor_nombre ? `Prov: ${i.proveedor_nombre}` : 'Sin Proveedor'}
                          </p>
                        </div>
                        {i.costo_total && <div className="text-red-400 font-black italic whitespace-nowrap">S/. {i.costo_total?.toFixed(2)}</div>}
                      </div>
                      
                      <div className="bg-black/40 rounded-[1.5rem] lg:rounded-2xl p-4 mb-5 lg:mb-6 space-y-3 border border-white/5">
                        <div className="flex justify-between items-center gap-2">
                          <div className="truncate flex-1">
                            <p className="text-[8px] lg:text-[9px] text-slate-500 uppercase font-black tracking-widest">Correo</p>
                            <p className="text-xs lg:text-sm font-bold text-slate-200 truncate" title={i.correo}>{i.correo}</p>
                          </div>
                          <button onClick={() => copiarAlPortapapeles(i.correo)} className="text-slate-600 hover:text-white p-2 transition-colors flex-shrink-0">
                            <Copy size={14}/>
                          </button>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <div className="truncate flex-1">
                            <p className="text-[8px] lg:text-[9px] text-slate-500 uppercase font-black tracking-widest">Contraseña</p>
                            <p className="text-xs lg:text-sm font-bold text-slate-200 truncate" title={i.contrasena}>{i.contrasena}</p>
                          </div>
                          <button onClick={() => copiarAlPortapapeles(i.contrasena)} className="text-slate-600 hover:text-white p-2 transition-colors flex-shrink-0">
                            <Copy size={14}/>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-5 lg:pt-6 mt-auto">
                        <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${diasInv < 0 ? 'text-red-500' : diasInv <= 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                              <Clock size={12}/> {i.fecha_vencimiento ? new Date(i.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                            </div>
                            {i.fecha_vencimiento && <div className="text-[8px] lg:text-[9px] font-bold text-slate-600 uppercase">{diasInv === 0 ? "¡Vence hoy!" : diasInv > 0 ? `Faltan ${diasInv} días` : `Venció hace ${Math.abs(diasInv)} días`}</div>}
                         </div>
                        <div className="flex gap-1 lg:gap-2">
                          <button onClick={() => enviarWhatsAppProveedor(i)} className={`p-2 transition-colors ${!i.proveedor_whatsapp ? 'text-slate-700 cursor-not-allowed' : 'text-emerald-400 hover:text-emerald-300'}`} title="Contactar Proveedor">
                            <MessageCircle size={16}/>
                          </button>
                          <button onClick={() => abrirEdicionStock(i)} className="text-slate-500 hover:text-white p-2 transition-colors" title="Editar">
                            <Edit3 size={16}/>
                          </button>
                          {/* NUEVO BOTÓN: Renovar Stock */}
                          <button onClick={() => handleRenovacionStock(i)} className="text-emerald-500 hover:text-emerald-400 p-2 transition-colors hover:scale-110" title="Renovar +1 Mes">
                            <RefreshCw size={16}/>
                          </button>
                          <button onClick={() => { if(window.confirm('¿Eliminar cuenta maestra?')) supabase.from('inventario').delete().eq('id', i.id).then(() => cargarTodo(session.user.id))}} className="text-red-500/50 hover:text-red-500 p-2 transition-colors" title="Eliminar">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* FINANZAS UNIFICADAS */}
        {vistaActual === 'finanzas' && (
          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 lg:pb-0">
            <header className="flex items-center gap-4 mb-6 pt-2 lg:pt-4">
              <div className="w-0 lg:w-16"></div>
              <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Historial</h2>
            </header>

            <div className="flex gap-2 lg:gap-3 mb-8 lg:mb-10 overflow-x-auto pb-4 custom-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0">
              <div className="hidden lg:block w-16 flex-shrink-0"></div>
              {mesesDisponibles.map(m => (
                <button 
                  key={m} 
                  onClick={() => setMesFiltroFinanzas(m)} 
                  className={`flex-shrink-0 px-5 py-2 md:px-6 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${mesFiltroFinanzas === m ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="space-y-3">
                {finanzasFiltradas.length === 0 ? (
                  <p className="text-center text-slate-500 text-xs md:text-sm mt-10 italic">No hay movimientos en este mes.</p>
                ) : (
                  finanzasFiltradas.map(f => (
                    <div key={f.id} className={`bg-white/[0.02] border border-white/5 p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex justify-between items-center hover:bg-white/[0.04] transition-all border-l-4 ${f.tipo === 'ingreso' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                      <div className="flex gap-3 lg:gap-6 items-center italic">
                         <span className="text-slate-600 text-[8px] lg:text-[10px] font-black uppercase tracking-widest min-w-[65px] lg:min-w-[80px]">
                           {new Date(f.fecha).toLocaleDateString()}
                         </span>
                         <div>
                            <span className="text-white font-black uppercase text-xs lg:text-sm block">{f.titulo}</span>
                            <span className="text-[8px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-bold">{f.servicio}</span>
                         </div>
                      </div>
                      <span className={`font-black italic text-base lg:text-lg whitespace-nowrap ${f.tipo === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {f.tipo === 'ingreso' ? '+' : '-'} S/. {f.monto?.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
            </div>
          </div>
        )}

        {/* AJUSTES */}
        {vistaActual === 'ajustes' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20 lg:pb-0">
            <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase mb-8 lg:mb-12 pt-2 lg:pt-4 tracking-tighter">Ajustes</h2>
            <div className="bg-white/[0.02] border border-white/10 p-6 lg:p-12 rounded-[2rem] lg:rounded-[3.5rem] space-y-8 lg:space-y-10">
                <div className="space-y-4">
                    <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nombre del Administrador</label>
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                        <input 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)} 
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none focus:border-blue-500/50" 
                        />
                        <button 
                          onClick={handleGuardarNombre} 
                          className="w-full sm:w-auto justify-center bg-white text-black px-6 py-4 lg:px-8 lg:py-0 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                        >
                           <Save size={16}/> Guardar Nombre
                        </button>
                    </div>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    <div className="space-y-3">
                        <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Sistema</label>
                        <input readOnly value={session.user.email} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-slate-600 font-bold cursor-not-allowed" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nueva Contraseña</label>
                        <div className="relative">
                            <input 
                              type={showPass ? "text" : "password"} 
                              value={newPassword} 
                              onChange={(e) => setNewPassword(e.target.value)} 
                              placeholder="Mínimo 6 caracteres" 
                              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none focus:border-blue-500/50" 
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                              {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                </div>
                <button 
                  disabled={updatingPass} 
                  onClick={handleActualizarPassword} 
                  className="w-full bg-blue-600 py-5 lg:py-6 rounded-2xl font-black uppercase italic tracking-widest text-[10px] lg:text-xs flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                >
                    <RefreshCw size={16} className={updatingPass ? 'animate-spin' : ''}/> {updatingPass ? 'PROCESANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-6 z-[70] animate-in zoom-in duration-300 overflow-y-auto">
          <div className="bg-[#0a0a0f] border border-white/10 p-6 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] w-full max-w-xl my-8 mx-2 sm:mx-4">
            <div className="flex justify-between items-center mb-8 lg:mb-10">
                <h3 className="text-2xl lg:text-3xl font-black italic text-white uppercase tracking-tighter">{editId ? 'Editar' : 'Venta'}</h3>
                <button onClick={cerrarModal} className="text-slate-500 hover:text-white p-2">
                  <X size={24} className="lg:w-7 lg:h-7"/>
                </button>
            </div>
            <form onSubmit={handleGuardarCliente} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <input 
                required 
                value={form.nombre} 
                onChange={e => setForm({...form, nombre: e.target.value})} 
                className="sm:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="Nombre completo" 
              />
              <input 
                required 
                value={form.whatsapp} 
                onChange={e => setForm({...form, whatsapp: e.target.value})} 
                className="sm:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="WhatsApp (519...)" 
              />
              
              <select 
                required 
                value={form.servicio} 
                onChange={e => setForm({...form, servicio: e.target.value})} 
                className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none appearance-none"
              >
                <option value="" className="bg-slate-900">Servicio...</option>
                {SERVICIOS_PREDEFINIDOS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                <option value="Otros" className="bg-slate-900">Otros (Especificar)</option>
              </select>
              
              <input 
                required 
                type="number" 
                step="0.01" 
                value={form.monto} 
                onChange={e => setForm({...form, monto: e.target.value})} 
                className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="Precio S/." 
              />
              
              {form.servicio === 'Otros' && (
                <input 
                  required 
                  value={form.customServicio} 
                  onChange={e => setForm({...form, customServicio: e.target.value})} 
                  className="sm:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                  placeholder="Escribe el nombre del servicio..." 
                />
              )}

              <div className="sm:col-span-2 mt-2">
                <label className="text-[9px] lg:text-[10px] font-black text-slate-500 ml-3 lg:ml-5 uppercase italic mb-1 block tracking-widest">Fecha Vencimiento</label>
                <input 
                  required 
                  type="date" 
                  value={form.vencimiento} 
                  onChange={e => setForm({...form, vencimiento: e.target.value})} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-slate-400 font-bold outline-none" 
                />
              </div>
              <button 
                type="submit" 
                className="sm:col-span-2 bg-blue-600 py-5 lg:py-6 rounded-2xl font-black uppercase italic tracking-widest shadow-2xl mt-4 text-xs"
              >
                GUARDAR REGISTRO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STOCK */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-6 z-[70] animate-in zoom-in duration-300 overflow-y-auto">
          <div className="bg-[#0a0a0f] border border-white/10 p-6 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] w-full max-w-xl my-8 mx-2 sm:mx-4">
            <div className="flex justify-between items-center mb-8 lg:mb-10">
                <h3 className="text-2xl lg:text-3xl font-black italic text-white uppercase tracking-tighter">{editInvId ? 'Editar Cuenta' : 'Nueva Cuenta Maestra'}</h3>
                <button onClick={cerrarInvModal} className="text-slate-500 hover:text-white p-2">
                  <X size={24} className="lg:w-7 lg:h-7"/>
                </button>
            </div>
            
            <form onSubmit={handleGuardarStock} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="sm:col-span-2">
                <select 
                  required 
                  value={invForm.servicio} 
                  onChange={e => setInvForm({...invForm, servicio: e.target.value})} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none appearance-none"
                >
                  <option value="" className="bg-slate-900">Selecciona el servicio...</option>
                  {SERVICIOS_PREDEFINIDOS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  <option value="Otros" className="bg-slate-900">Otros (Especificar)</option>
                </select>
              </div>

              {invForm.servicio === 'Otros' && (
                <div className="sm:col-span-2">
                  <input 
                    required 
                    value={invForm.customServicio} 
                    onChange={e => setInvForm({...invForm, customServicio: e.target.value})} 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                    placeholder="Escribe el nombre del servicio..." 
                  />
                </div>
              )}

              <input 
                required 
                type="email" 
                value={invForm.correo} 
                onChange={e => setInvForm({...invForm, correo: e.target.value})} 
                className="sm:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="Correo de la cuenta *" 
              />
              <input 
                required 
                type="text" 
                value={invForm.contrasena} 
                onChange={e => setInvForm({...invForm, contrasena: e.target.value})} 
                className="sm:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="Contraseña *" 
              />
              
              <div className="sm:col-span-2 border-t border-white/5 pt-5 lg:pt-6 mt-2">
                <p className="text-[9px] lg:text-[10px] font-black text-slate-500 ml-3 lg:ml-5 uppercase italic mb-3 lg:mb-4 block tracking-widest">Datos del Proveedor (Opcional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <input 
                    type="text" 
                    value={invForm.proveedor_nombre} 
                    onChange={e => setInvForm({...invForm, proveedor_nombre: e.target.value})} 
                    className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                    placeholder="Nombre Proveedor" 
                  />
                  <input 
                    type="text" 
                    value={invForm.proveedor_whatsapp} 
                    onChange={e => setInvForm({...invForm, proveedor_whatsapp: e.target.value})} 
                    className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                    placeholder="WhatsApp (519...)" 
                  />
                </div>
              </div>

              <input 
                type="number" 
                step="0.01" 
                value={invForm.costo} 
                onChange={e => setInvForm({...invForm, costo: e.target.value})} 
                className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-white font-bold outline-none" 
                placeholder="Costo Total S/." 
              />
              
              <div>
                <input 
                  required 
                  type="date" 
                  value={invForm.vencimiento} 
                  onChange={e => setInvForm({...invForm, vencimiento: e.target.value})} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 text-sm lg:text-base text-slate-400 font-bold outline-none" 
                  title="Fecha Vencimiento" 
                />
              </div>

              <button 
                type="submit" 
                className="sm:col-span-2 bg-white text-black py-5 lg:py-6 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl mt-4 text-xs"
              >
                {editInvId ? 'ACTUALIZAR CUENTA' : 'GUARDAR CUENTA'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;