import { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', departamento: '', observacao: '' });

  const loadUsuarios = async () => {
    try { setUsuarios(await api.getUsuarios()); }
    catch (error) { console.error('Erro ao carregar usuários:', error); }
  };

  useEffect(() => { loadUsuarios(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try { await api.createUsuario(form); setForm({ nome: '', email: '', departamento: '', observacao: '' }); await loadUsuarios(); }
    catch (error) { alert('Erro ao cadastrar usuário.'); console.error(error); }
  };

  const remover = async (id) => {
    if (!confirm('Desativar este usuário?')) return;
    try { await api.deleteUsuario(id); await loadUsuarios(); }
    catch (error) { alert('Erro ao remover usuário.'); console.error(error); }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      <form onSubmit={submit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 h-fit">
        <h1 className="text-2xl font-bold text-white mb-1">Cadastro de usuários</h1>
        <p className="text-gray-400 mb-6">Cadastro organizacional para relatórios e futuras associações aos eventos.</p>
        <label className="block mb-4"><span className="text-sm text-gray-300">Nome</span><input className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></label>
        <label className="block mb-4"><span className="text-sm text-gray-300">E-mail</span><input type="email" className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block mb-4"><span className="text-sm text-gray-300">Departamento / grupo</span><input className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} /></label>
        <label className="block mb-6"><span className="text-sm text-gray-300">Observação</span><textarea className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} rows={3} /></label>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"><PlusIcon className="w-5 h-5" />Cadastrar usuário</button>
      </form>

      <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-5">Usuários cadastrados</h2>
        {usuarios.length === 0 ? <p className="text-gray-400">Nenhum usuário cadastrado.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-left">
            <thead className="text-gray-400 text-sm border-b border-gray-700"><tr><th className="py-3">Nome</th><th className="py-3">E-mail</th><th className="py-3">Departamento</th><th className="py-3 text-right">Ações</th></tr></thead>
            <tbody>{usuarios.map((u) => <tr key={u._id} className="border-b border-gray-700/60"><td className="py-4 text-white font-medium">{u.nome}</td><td className="py-4 text-gray-300">{u.email || '-'}</td><td className="py-4 text-gray-300">{u.departamento || '-'}</td><td className="py-4 text-right"><button onClick={() => remover(u._id)} className="p-2 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-800"><TrashIcon className="w-5 h-5" /></button></td></tr>)}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
};
