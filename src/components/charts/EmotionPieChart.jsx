import { Pie } from "react-chartjs-2";

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

export const EmotionPieChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((d) => traduzirEmocao(d.name)),
        datasets: [
            {
                data: data.map((d) => d.value || 0),
                backgroundColor: data.map((d) => getEmotionColor(d.name)),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "white",
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || "";

                        if (label) {
                            label += ": ";
                        }

                        const total = context.dataset.data.reduce(
                            (acc, value) => acc + value,
                            0
                        );

                        const percentage =
                            total > 0
                                ? ((context.parsed / total) * 100).toFixed(1)
                                : 0;

                        label += `${context.parsed} (${percentage}%)`;

                        return label;
                    },
                },
            },
        },
    };

    if (!data.length) {
        return (
            <div className="p-4 bg-gray-800 rounded-lg shadow w-full h-96 flex items-center justify-center text-gray-400">
                Nenhuma emoção registrada ainda.
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow w-full h-96">
            <h2 className="text-lg font-semibold text-white mb-2">
                Distribuição de Emoções
            </h2>

            <div className="h-[calc(100%-2.5rem)] flex items-center justify-center">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};