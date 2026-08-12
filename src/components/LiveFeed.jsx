import { useEffect, useState } from "react";
import {
    CameraIcon,
    PlayIcon,
    StopIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";

const CAMERA_TESTE_NOME = "Webcam Local - Teste";
const CAMERA_TESTE_ORIGEM = "0";

export const LiveFeed = () => {
    const [camera, setCamera] = useState(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [modo, setModo] = useState("individual");
    const [erro, setErro] = useState("");
    const [reloadKey, setReloadKey] = useState(Date.now());

    const carregarOuCriarCameraTeste = async () => {
        try {
            setErro("");
            setLoading(true);

            const cameras = await api.getCameras();

            let webcamTeste = cameras.find(
                (cam) =>
                    cam.nome === CAMERA_TESTE_NOME ||
                    cam.origem === CAMERA_TESTE_ORIGEM
            );

            if (!webcamTeste) {
                webcamTeste = await api.createCamera({
                    nome: CAMERA_TESTE_NOME,
                    origem: CAMERA_TESTE_ORIGEM,
                    ativa: true,
                    modo_monitoramento: "individual",
                });
            }

            setCamera(webcamTeste);
            setModo(webcamTeste.modo_monitoramento || "individual");
        } catch (error) {
            console.error("[LIVE FEED] Erro ao carregar/criar câmera:", error);
            setErro("Não foi possível carregar ou criar a câmera local de teste.");
        } finally {
            setLoading(false);
        }
    };

    const iniciarMonitoramento = async () => {
        if (!camera?._id) return;

        try {
            setErro("");
            await api.startCamera(camera._id);
            setRunning(true);
            setReloadKey(Date.now());
        } catch (error) {
            console.error("[LIVE FEED] Erro ao iniciar câmera:", error);
            setErro("Erro ao iniciar a câmera. Verifique se a webcam está livre e conectada.");
        }
    };

    const pararMonitoramento = async () => {
        if (!camera?._id) return;

        try {
            await api.stopCamera(camera._id);
            setRunning(false);
        } catch (error) {
            console.error("[LIVE FEED] Erro ao parar câmera:", error);
        }
    };

    const alterarModo = async () => {
        if (!camera?._id) return;

        const novoModo = modo === "individual" ? "sala" : "individual";

        try {
            setErro("");
            await api.updateCameraMode(camera._id, novoModo);
            setModo(novoModo);
            setReloadKey(Date.now());
        } catch (error) {
            console.error("[LIVE FEED] Erro ao alterar modo:", error);
            setErro("Não foi possível alterar o modo de monitoramento.");
        }
    };

    useEffect(() => {
        carregarOuCriarCameraTeste();

        return () => {
            if (camera?._id) {
                api.stopCamera(camera._id).catch(() => {});
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-gray-800 rounded-lg shadow h-full flex items-center justify-center">
                <div className="text-gray-300 text-lg flex items-center gap-3">
                    <ArrowPathIcon className="w-6 h-6 animate-spin" />
                    Preparando webcam local...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow h-full flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <CameraIcon className="w-6 h-6" />
                        Live Feed — Webcam Local
                    </h1>

                    <p className="text-sm text-gray-400 mt-1">
                        Tela simples para testar a webcam local usando a câmera de origem{" "}
                        <span className="font-mono text-indigo-300">0</span>.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2">
                        <span className="text-sm text-gray-300">
                            Modo:
                        </span>

                        <button
                            onClick={alterarModo}
                            className={`relative w-14 h-7 rounded-full transition ${
                                modo === "individual" ? "bg-indigo-600" : "bg-emerald-600"
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                                    modo === "individual" ? "left-1" : "left-8"
                                }`}
                            />
                        </button>

                        <span className="text-sm font-semibold text-white">
                            {modo === "individual"
                                ? "Faces individuais"
                                : "Emoção geral da sala"}
                        </span>
                    </div>

                    {!running ? (
                        <button
                            onClick={iniciarMonitoramento}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <PlayIcon className="w-5 h-5" />
                            Iniciar
                        </button>
                    ) : (
                        <button
                            onClick={pararMonitoramento}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <StopIcon className="w-5 h-5" />
                            Parar
                        </button>
                    )}
                </div>
            </div>

            {erro && (
                <div className="mb-4 p-4 bg-red-900/60 border border-red-500 text-red-200 rounded-lg">
                    {erro}
                </div>
            )}

            <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center min-h-[420px]">
                {camera?._id ? (
                    <img
                        key={reloadKey}
                        src={`${api.videoFeedUrl(camera._id)}?t=${reloadKey}`}
                        alt="Transmissão da webcam local"
                        className="w-full h-full object-contain"
                        onLoad={() => setRunning(true)}
                        onError={() => {
                            setErro(
                                "Erro ao carregar o stream. Verifique se o back-end está rodando e se a webcam não está sendo usada por outro programa."
                            );
                        }}
                    />
                ) : (
                    <div className="text-gray-400">
                        Nenhuma câmera de teste encontrada.
                    </div>
                )}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <span className="text-gray-500">Câmera</span>
                    <p className="text-white font-semibold">
                        {camera?.nome || "Webcam Local"}
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <span className="text-gray-500">Origem</span>
                    <p className="text-white font-mono">
                        {camera?.origem || "0"}
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <span className="text-gray-500">Status</span>
                    <p className={running ? "text-green-400" : "text-red-400"}>
                        {running ? "Monitoramento ativo" : "Monitoramento parado"}
                    </p>
                </div>
            </div>
        </div>
    );
};