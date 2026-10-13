import ChartCard from "../ChartCard";

interface Props {
  data: number[];
}

const NPSChart = ({ data }: Props) => {
  const categories = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    .map(String)
    .filter((category) => category.length > 0);
  const colors = [
    "#EF4444", "#EF4444", "#EF4444", "#EF4444", "#EF4444",
    "#F59E0B", "#F59E0B",
    "#10B981", "#10B981", "#10B981",
  ].filter((color) => typeof color === "string" && color.length > 0);
  const safeData = Array.isArray(data)
    ? data.map((value) => (Number.isFinite(Number(value)) ? Number(value) : 0))
    : [];
  const hasData = safeData.some((value) => value > 0);

  return hasData ? (
    <ChartCard
      title="Del 1 al 10 ¿Qué tanto recomendarías este curso?"
      subtitle="Net Promoter Score (NPS)"
      type="bar"
      series={[{ name: "Respuestas", data: safeData }]}
      options={{
        plotOptions: {
          bar: { borderRadius: 4, columnWidth: "70%", distributed: true },
        },
        colors,
        xaxis: {
          categories,
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
              `${Number.isFinite(Number(val)) ? Number(val) : 0} ${
                Number(val) === 1 ? "persona" : "personas"
              }`,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => {
            const value = Number.isFinite(Number(val)) ? Number(val) : 0;
            return value > 0 ? String(value) : "";
          },
        },
      }}
      badgeText="NPS"
      height={350}
      showUpdateDate={false}
    />
  ) : (
    <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">
        Del 1 al 10 ¿Qué tanto recomendarías este curso?
      </h2>
      <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "350px" }}>
        Aún no hay respuestas de NPS
      </div>
    </div>
  );
};

export default NPSChart;
