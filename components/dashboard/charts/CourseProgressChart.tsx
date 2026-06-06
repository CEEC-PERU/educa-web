import ChartCard from "../ChartCard";
import { CourseProgress } from "../../../interfaces/dashboard";

interface Props {
  data: CourseProgress[];
}

const CourseProgressChart = ({ data }: Props) => (
  <ChartCard
    title="Progreso del curso"
    type="bar"
    series={[
      { name: "Estudiantes", data: data.map((item) => item.Estudiantes) },
      { name: "Progreso", data: data.map((item) => item.Progreso) },
    ]}
    options={{
      xaxis: {
        categories: data.map((item) => item.course),
        title: { text: "Cursos" },
      },
      yaxis: { title: { text: "Cantidad" } },
      colors: ["#3274C1", "#BCB623"],
      dataLabels: { enabled: true },
      legend: { position: "top" },
    }}
    height={300}
    showUpdateDate={false}
  />
);

export default CourseProgressChart;
