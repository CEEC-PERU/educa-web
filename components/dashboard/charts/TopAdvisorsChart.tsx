import ChartCard from "../ChartCard";
import { TopRanking } from "../../../interfaces/dashboard";

interface Props {
  data: TopRanking[];
}

const TopAdvisorsChart = ({ data }: Props) => {
  const safeData = Array.isArray(data)
    ? data
        .filter(
          (item) =>
            typeof item.name === "string" &&
            item.name.trim().length > 0 &&
            Number.isFinite(Number(item.puntaje)),
        )
        .map((item) => ({ name: item.name, puntaje: Number(item.puntaje) }))
    : [];

  if (safeData.length === 0) {
    return (
      <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Top 5 de Asesores</h2>
        </div>
        <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "300px" }}>
          Ningún alumno ha completado este curso
        </div>
      </div>
    );
  }

  return (
    <ChartCard
      title="Top 5 de Asesores"
      type="bar"
      series={[{ name: "Puntaje", data: safeData.map((item) => item.puntaje) }]}
      options={{
        plotOptions: {
          bar: { borderRadius: 6, columnWidth: "60%" },
        },
        xaxis: {
          categories: safeData.map((item) => item.name),
          labels: {
            formatter: (value) =>
              String(value).length > 15
                ? `${String(value).substring(0, 15)}...`
                : String(value),
          },
        },
        yaxis: { max: 20, min: 0, tickAmount: 5 },
        tooltip: {
          y: {
            formatter: (val: number) =>
              `${Number.isFinite(Number(val)) ? Number(val) : 0} pts`,
          },
        },
      }}
      badgeText="Puntaje"
      showUpdateDate={false}
    />
  );
};

export default TopAdvisorsChart;
