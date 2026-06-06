import ChartCard from "../ChartCard";
import { TopRanking } from "../../../interfaces/dashboard";

interface Props {
  data: TopRanking[];
}

const TopAdvisorsChart = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Top 5 de Asesores</h2>
        </div>
        <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "300px" }}>
          Selecciona un curso para ver el ranking
        </div>
      </div>
    );
  }

  return (
    <ChartCard
      title="Top 5 de Asesores"
      type="bar"
      series={[{ name: "Puntaje", data: data.map((item) => item.puntaje) }]}
      options={{
        plotOptions: {
          bar: { borderRadius: 6, columnWidth: "60%" },
        },
        xaxis: {
          categories: data.map((item) => item.name),
          labels: {
            formatter: (value) =>
              value.length > 15 ? `${value.substring(0, 15)}...` : value,
          },
        },
        yaxis: { max: 20, min: 0, tickAmount: 5 },
        tooltip: {
          y: { formatter: (val: number) => `${val} pts` },
        },
      }}
      badgeText="Puntaje"
      showUpdateDate={false}
    />
  );
};

export default TopAdvisorsChart;
