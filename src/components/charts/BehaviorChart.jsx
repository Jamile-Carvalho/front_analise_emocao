import { Bar } from "react-chartjs-2";

export const BehaviorChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((d) => d.name || "Indefinido"),
        datasets: [
            {
                label: "Comportamentos",
                data: data.map((d) => d.value || 0),
                backgroundColor: data.map((d) => {
                    const name = String(d.name || "").toLowerCase();

                    if (name.includes("positivo")) return "#22C55E";
                    if (name.includes("agressivo")) return "#EF4444";
                    if (name.includes("depressivo")) return "#3B82F6";
                    if (name.includes("neutro")) return "#FACC15";

                    return "#9CA3AF";
                }),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Comportamentos Detectados",
                color: "white",
                font: { size: 16 },
            },
        },
        scales: {
            x: {
                ticks: { color: "white" },
                grid: { color: "#444" },
            },
            y: {
                ticks: {
                    color: "white",
                    precision: 0,
                },
                grid: { color: "#444" },
                beginAtZero: true,
            },
        },
    };

    if (!data.length) {
        return (
            <div className="p-4 bg-gray-800 rounded-lg shadow w-full text-gray-400 text-center">
                Nenhum comportamento registrado ainda.
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};