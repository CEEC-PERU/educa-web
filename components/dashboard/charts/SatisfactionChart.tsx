import ChartCard from "../ChartCard";

interface Props {
  data: number[];
}

const SatisfactionChart = ({ data }: Props) => {
  const safeData = Array.isArray(data)
    ? data.map((value) => (Number.isFinite(Number(value)) ? Number(value) : 0))
    : [];
  const hasData = safeData.some((value) => value > 0);

  return hasData ? (
    <ChartCard
      title="Encuesta de Satisfacción"
      type="donut"
      series={safeData}
      options={{
        labels: ["1 ⭐", "2 ⭐", "3 ⭐", "4 ⭐", "5 ⭐"],
        colors: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5"],
        legend: { position: "bottom" },
        dataLabels: { enabled: true },
      }}
      height={300}
      showUpdateDate={false}
    />
  ) : (
    <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">Encuesta de Satisfacción</h2>
      <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "300px" }}>
        Aún no hay respuestas de satisfacción
      </div>
    </div>
  );
};

export default SatisfactionChart;
