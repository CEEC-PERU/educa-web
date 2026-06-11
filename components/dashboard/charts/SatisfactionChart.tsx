import ChartCard from "../ChartCard";

interface Props {
  data: number[];
}

const SatisfactionChart = ({ data }: Props) => (
  <ChartCard
    title="Encuesta de Satisfacción"
    type="donut"
    series={data}
    options={{
      labels: ["1 ⭐", "2 ⭐", "3 ⭐", "4 ⭐", "5 ⭐"],
      colors: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5"],
      legend: { position: "bottom" },
      dataLabels: { enabled: true },
    }}
    height={300}
    showUpdateDate={false}
  />
);

export default SatisfactionChart;
