import ChartCard from "../ChartCard";

interface Props {
  data: number[];
}

const NPSChart = ({ data }: Props) => (
  <ChartCard
    title="Del 1 al 10 ¿Qué tanto recomendarías este curso?"
    subtitle="Net Promoter Score (NPS)"
    type="bar"
    series={[{ name: "Respuestas", data }]}
    options={{
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: "70%", distributed: true },
      },
      colors: [
        "#EF4444", "#EF4444", "#EF4444", "#EF4444", "#EF4444",
        "#F59E0B", "#F59E0B",
        "#10B981", "#10B981", "#10B981",
      ],
      xaxis: {
        categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        title: {
          text: "Puntuación",
          style: { fontSize: "14px", fontWeight: 600, color: "#4B5563" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: {
          text: "Número de respuestas",
          style: { fontSize: "14px", fontWeight: 600, color: "#4B5563" },
        },
        min: 0,
        forceNiceScale: true,
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${val} ${val === 1 ? "persona" : "personas"}`,
        },
      },
      dataLabels: {
        formatter: (val: number) => (val > 0 ? val.toString() : ""),
      },
    }}
    badgeText="NPS"
    height={350}
    showUpdateDate={false}
  />
);

export default NPSChart;
