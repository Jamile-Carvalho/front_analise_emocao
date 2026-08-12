import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const CameraFormModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({ nome: '', origem: '0', ativa: true, modo_monitoramento: 'individual' });

  useEffect(() => {
    setForm(initialData ? {
      nome: initialData.nome || '',
      origem: initialData.origem || '0',
      ativa: initialData.ativa ?? true,
      modo_monitoramento: initialData.modo_monitoramento || 'individual',
    } : { nome: '', origem: '0', ativa: true, modo_monitoramento: 'individual' });
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Editar câmera' : 'Adicionar câmera'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
        </div>

        <label className="block mb-4">
          <span className="text-sm text-gray-300">Nome da câmera</span>
          <input className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Entrada principal" required />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-300">Origem / link da câmera</span>
          <input className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} placeholder="0, 1, rtsp://..., http://..." required />
          <p className="text-xs text-gray-500 mt-1">Use 0 para webcam local ou informe link RTSP/HTTP.</p>
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-300">Modo padrão</span>
          <select className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-indigo-500" value={form.modo_monitoramento} onChange={(e) => setForm({ ...form, modo_monitoramento: e.target.value })}>
            <option value="individual">Indivíduos e cada face</option>
            <option value="sala">Emoção geral da sala</option>
          </select>
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">Salvar</button>
        </div>
      </form>
    </div>
  );
};
