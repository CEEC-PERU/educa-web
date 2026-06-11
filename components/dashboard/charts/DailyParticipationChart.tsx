import ChartCard from "../ChartCard";
import { ActiveUser } from "../../../interfaces/dashboard";

interface Props {
  data: ActiveUser[];
}

const DailyParticipationChart = ({ data }: Props) => (
  <ChartCard
    title="Participación Diaria (estudiantes activos)"
    type="line"
    series={[{ name: "Cantidad", data: data.map((item) => item.active) }]}
    options={{
      xaxis: {
        categories: data.map((item) => item.day),
        title: { text: "Día" },
      },
      yaxis: { title: { text: "Cantidad Estudiantes" } },
      colors: ["#33b2df"],
      stroke: { curve: "smooth" },
      dataLabels: { enabled: true },
    }}
    height={300}
    showUpdateDate={false}
  />
);

export default DailyParticipationChart;
