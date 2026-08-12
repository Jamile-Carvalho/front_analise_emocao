import { useEffect, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowsPointingOutIcon, XMarkIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { CameraFormModal } from './CameraFormModal';

export const CamerasMonitor = () => {
  const [cameras, setCameras] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [expandedCamera, setExpandedCamera] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCameras = async () => {
    try { setCameras(await api.getCameras()); }
    catch (error) { console.error('Erro ao buscar câmeras:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCameras(); }, []);

  const saveCamera = async (payload) => {
    try {
      if (editingCamera) await api.updateCamera(editingCamera._id, payload);
      else await api.createCamera(payload);
      setModalOpen(false); setEditingCamera(null); await loadCameras();
    } catch (error) { alert('Erro ao salvar câmera.'); console.error(error); }
  };

  const removeCamera = async (camera) => {
    if (!confirm(`Remover a câmera "${camera.nome}"?`)) return;
    try { await api.deleteCamera(camera._id); if (expandedCamera?._id === camera._id) setExpandedCamera(null); await loadCameras(); }
    catch (error) { alert('Erro ao remover câmera.'); console.error(error); }
  };

  const toggleMode = async (camera) => {
    const novoModo = camera.modo_monitoramento === 'individual' ? 'sala' : 'individual';
    try {
      await api.updateCameraMode(camera._id, novoModo);
      const updated = { ...camera, modo_monitoramento: novoModo };
      setExpandedCamera(updated);
      setCameras((prev) => prev.map((c) => c._id === camera._id ? updated : c));
    } catch (error) { alert('Erro ao alterar modo.'); console.error(error); }
  };

  const CameraTile = ({ camera }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow">
      <div className="aspect-video bg-black relative group">
        <img src={api.videoFeedUrl(camera._id)} alt={camera.nome} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button onClick={() => setExpandedCamera(camera)} className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500" title="Expandir"><ArrowsPointingOutIcon className="w-5 h-5" /></button>
          <button onClick={() => api.startCamera(camera._id)} className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500" title="Iniciar"><PlayIcon className="w-5 h-5" /></button>
          <button onClick={() => api.stopCamera(camera._id)} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-500" title="Parar"><StopIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold">{camera.nome}</h3>
          <p className="text-xs text-gray-400 truncate max-w-[220px]">{camera.origem}</p>
          <p className="text-xs text-indigo-400 mt-1">{camera.modo_monitoramento === 'individual' ? 'Modo: indivíduos e faces' : 'Modo: emoção geral da sala'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditingCamera(camera); setModalOpen(true); }} className="p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"><PencilSquareIcon className="w-5 h-5" /></button>
          <button onClick={() => removeCamera(camera)} className="p-2 rounded-lg bg-red-900/60 text-red-300 hover:bg-red-800"><TrashIcon className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="text-white text-xl">Carregando câmeras...</div>;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Central de Monitoramento</h1><p className="text-gray-400">Grade estilo câmeras de segurança.</p></div>
        <button onClick={() => { setEditingCamera(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"><PlusIcon className="w-5 h-5" />Adicionar câmera</button>
      </div>

      {cameras.length === 0 ? <div className="border border-dashed border-gray-700 rounded-xl p-10 text-center text-gray-400">Nenhuma câmera cadastrada.</div> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{cameras.map((camera) => <CameraTile key={camera._id} camera={camera} />)}</div>}

      {expandedCamera && (
        <div className="fixed inset-0 z-40 bg-black/90 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-2xl font-bold text-white">{expandedCamera.nome}</h2><p className="text-gray-400">{expandedCamera.origem}</p></div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>Emoção geral da sala</span>
                <button onClick={() => toggleMode(expandedCamera)} className={`w-14 h-7 rounded-full p-1 transition ${expandedCamera.modo_monitoramento === 'individual' ? 'bg-indigo-600' : 'bg-gray-600'}`} title="Alternar modo">
                  <span className={`block w-5 h-5 bg-white rounded-full transition ${expandedCamera.modo_monitoramento === 'individual' ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
                <span>Indivíduos e faces</span>
              </div>
              <button onClick={() => setExpandedCamera(null)} className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
            </div>
          </div>
          <div className="flex-1 bg-black rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center"><img src={api.videoFeedUrl(expandedCamera._id)} alt={expandedCamera.nome} className="w-full h-full object-contain" /></div>
        </div>
      )}

      <CameraFormModal open={modalOpen} initialData={editingCamera} onClose={() => { setModalOpen(false); setEditingCamera(null); }} onSave={saveCamera} />
    </div>
  );
};
