import ChartCard from "../ChartCard";
import { CourseTimeAverage } from "../../../interfaces/Courses/CourseTime";

interface Props {
  data: CourseTimeAverage[];
}

const CourseTimeChart = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tiempo Promedio por Curso</h2>
        </div>
        <div className="relative flex items-center justify-center text-gray-400 text-sm" style={{ height: "300px" }}>
          Selecciona un curso para ver el tiempo promedio
        </div>
      </div>
    );
  }

  return (
    <ChartCard
      title="Tiempo Promedio por Curso"
      type="bar"
      series={[{ name: "Tiempo", data: data.map((item) => item.average_time) }]}
      options={{
        xaxis: {
          categories: data.map((item) => item.course_name),
          title: { text: "Cursos" },
        },
        yaxis: { title: { text: "Tiempo (minutos)" } },
        colors: ["#3274C1"],
        dataLabels: { enabled: true },
        legend: { position: "top" },
        tooltip: {
          y: {
            formatter: (val: number) => `${val} min`,
          },
        },
      }}
      height={300}
      showUpdateDate={false}
    />
  );
};

export default CourseTimeChart;
