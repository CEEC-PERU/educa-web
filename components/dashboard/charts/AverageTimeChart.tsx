import ChartCard from "../ChartCard";
import { AverageTime } from "../../../interfaces/dashboard";

interface Props {
  data: AverageTime[];
}

const AverageTimeChart = ({ data }: Props) => (
  <ChartCard
    title="Tiempo promedio por día en la plataforma"
    type="line"
    series={[{ name: "Tiempo", data: data.map((item) => item.time) }]}
    options={{
      xaxis: {
        categories: data.map((item) => item.day),
        title: { text: "Días" },
      },
      yaxis: { title: { text: "Tiempo (minutos)" } },
      colors: ["#1D4ED8"],
      stroke: { curve: "smooth" },
      dataLabels: { enabled: true },
      legend: { position: "top" },
    }}
    height={300}
    showUpdateDate={false}
  />
);

export default AverageTimeChart;
