import ChartCard from "../ChartCard";
import { ActiveUser } from "../../../interfaces/dashboard";

interface Props {
  data: ActiveUser[];
}

const DailyParticipationChart = ({ data }: Props) => (
  <ChartCard
    title="Participacion Diaria (estudiantes activos)"
    type="line"
    series={[{ name: "Cantidad", data: data.map((item) => item.active) }]}
    options={{
      xaxis: {
        categories: data.map((item) => item.day),
        title: { text: "Dia" },
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
