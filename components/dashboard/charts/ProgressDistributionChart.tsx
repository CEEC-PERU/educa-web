import ChartCard from "../ChartCard";
import { ProgressDistribution } from "../../../interfaces/dashboard";

interface Props {
  data: ProgressDistribution[];
}

const ProgressDistributionChart = ({ data }: Props) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  if (total === 0) {
    return (
      <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Distribución de progreso</h2>
            <p className="text-sm text-gray-500 mt-1">Estudiantes por rango de avance</p>
          </div>
        </div>
        <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "300px" }}>
          Selecciona un curso para ver la distribución
        </div>
      </div>
    );
  }

  return (
    <ChartCard
      title="Distribución de progreso"
      subtitle="Estudiantes por rango de avance"
      type="donut"
      series={data.map((item) => item.count)}
      options={{
        labels: data.map((item) => item.range),
        colors: ["#EF4444", "#F59E0B", "#EAB308", "#10B981"],
        legend: { position: "bottom" },
        tooltip: {
          y: {
            formatter: (val: number) =>
              `${val} ${val === 1 ? "estudiante" : "estudiantes"}`,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${Math.round(val)}%`,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  formatter: () => `${total}`,
                },
              },
            },
          },
        },
      }}
      height={300}
      showUpdateDate={false}
    />
  );
};

export default ProgressDistributionChart;
