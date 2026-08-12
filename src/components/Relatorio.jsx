import { useEffect, useState } from 'react';
import { Users, Download, Activity, AlertTriangle, Camera, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const Relatorio = () => {
  const [resumo, setResumo] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      const [resumoData, usuariosData] = await Promise.all([api.getResumoRelatorios(), api.getRelatorioUsuarios()]);
      setResumo(resumoData); setUsuarios(usuariosData);
    } catch (error) { console.error('Erro ao carregar relatórios:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregar(); const interval = setInterval(carregar, 8000); return () => clearInterval(interval); }, []);
  if (loading) return <div className="text-white text-xl">Carregando relatórios...</div>;
  if (!resumo) return <div className="bg-red-900/40 border border-red-700 text-red-200 p-6 rounded-xl">Não foi possível carregar os relatórios.</div>;

  const cards = [
    { label: 'Eventos registrados', value: resumo.total_eventos, icon: Activity },
    { label: 'Alertas potenciais', value: resumo.total_alertas, icon: AlertTriangle },
    { label: 'Câmeras cadastradas', value: resumo.total_cameras, icon: Camera },
    { label: 'Usuários ativos', value: resumo.total_usuarios, icon: Users },
  ];

  return (
    <div className="min-h-full text-slate-300">
      <header className="mb-8 flex items-start justify-between gap-6">
        <div><div className="flex items-center gap-3 mb-2"><BarChart3 className="text-indigo-400 w-8 h-8" /><h1 className="text-3xl font-bold text-white">Relatórios Dinâmicos</h1></div><p className="text-slate-400">Dados gerados a partir dos eventos reais salvos no MongoDB.</p></div>
        <button onClick={() => window.print()} className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 border border-gray-700"><Download size={18} />Exportar / Imprimir</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="bg-gray-800 border border-gray-700 p-6 rounded-xl"><div className="flex items-center justify-between mb-3"><p className="text-gray-400 text-sm">{card.label}</p><Icon className="text-indigo-400" size={24} /></div><h2 className="text-3xl font-bold text-white">{card.value}</h2></div>; })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl"><h2 className="text-xl font-bold text-white mb-5">Distribuição por emoção</h2><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={resumo.por_emocao} dataKey="value" nameKey="name" outerRadius={110} label>{resumo.por_emocao.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} /></PieChart></ResponsiveContainer></div></div>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl"><h2 className="text-xl font-bold text-white mb-5">Eventos por câmera</h2><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={resumo.por_camera}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="name" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} /><Bar dataKey="value" fill="#6366f1" /></BarChart></ResponsiveContainer></div></div>
      </section>

      <section className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-5">Relatório por usuário cadastrado</h2>
        {usuarios.length === 0 ? <p className="text-gray-400">Nenhum usuário cadastrado ou nenhum dado associado.</p> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{usuarios.map((u) => <div key={u._id} className={`p-5 rounded-xl border bg-gray-900 ${u.status === 'warning' ? 'border-red-500/60' : 'border-gray-700'}`}><div className="flex items-start justify-between mb-4"><div><h3 className="text-white text-lg font-bold">{u.nome}</h3><p className="text-gray-400 text-sm">{u.email || 'Sem e-mail'}</p><p className="text-gray-500 text-xs">{u.departamento || 'Sem departamento'}</p></div>{u.status === 'warning' && <AlertTriangle className="text-red-400" />}</div><div className="grid grid-cols-4 gap-3 text-center"><div><p className="text-gray-500 text-xs">Eventos</p><p className="text-white font-bold text-xl">{u.total_eventos}</p></div><div><p className="text-gray-500 text-xs">Alertas</p><p className="text-red-400 font-bold text-xl">{u.alertas}</p></div><div><p className="text-gray-500 text-xs">Positivos</p><p className="text-emerald-400 font-bold text-xl">{u.positivos}</p></div><div><p className="text-gray-500 text-xs">Média</p><p className="text-indigo-400 font-bold text-xl">{u.pontuacao_media}</p></div></div><p className="text-xs text-gray-500 mt-4">Último evento: {u.ultimo_evento || 'Nenhum evento associado'}</p></div>)}</div>}
      </section>
    </div>
  );
};

export default Relatorio;
