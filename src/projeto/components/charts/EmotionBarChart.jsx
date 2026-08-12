import { Bar } from "react-chartjs-2";

const getEmotionColor = (emotion) => {
    const name = String(emotion || "").toLowerCase();

    if (name === "happy") return "#22C55E";
    if (name === "angry") return "#EF4444";
    if (name === "sad") return "#3B82F6";
    if (name === "surprise") return "#F97316";
    if (name === "neutral") return "#FACC15";
    if (name === "fear") return "#8B5CF6";
    if (name === "disgust") return "#A3E635";

    return "#9CA3AF";
};

const traduzirEmocao = (emotion) => {
    const mapa = {
        happy: "Feliz",
        angry: "Raiva",
        sad: "Triste",
        surprise: "Surpresa",
        neutral: "Neutro",
        fear: "Medo",
        disgust: "Nojo",
    };

    return mapa[emotion] || emotion || "Indefinido";
};

export const EmotionBarChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((d) => traduzirEmocao(d.name)),
        datasets: [
            {
                label: "Quantidade",
                data: data.map((d) => d.value || 0),
                backgroundColor: data.map((d) => getEmotionColor(d.name)),
            },
        ],
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Emoções Detectadas (Contagem Total)",
                color: "white",
                font: { size: 16 },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white",
                    precision: 0,
                },
                grid: { color: "#444" },
                beginAtZero: true,
            },
            y: {
                ticks: { color: "white" },
                grid: { color: "#444" },
            },
        },
    };

    if (!data.length) {
        return (
            <div className="p-4 bg-gray-800 rounded-lg shadow w-full text-gray-400 text-center">
                Nenhuma emoção registrada ainda.
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};