import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ChartErrorBoundary from "./ChartErrorBoundary";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: "bar" | "line" | "area" | "pie" | "donut" | "radar" | "heatmap";
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ApexOptions;
  height?: number | string;
  badgeText?: string;
  showUpdateDate?: boolean;
  className?: string;
}

function hasRenderableSeries(
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined,
) {
  if (!Array.isArray(series) || series.length === 0) {
    return false;
  }

  if (typeof series[0] === "number") {
    return series.some((value) => Number.isFinite(Number(value)));
  }

  return series.some(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      "data" in entry &&
      Array.isArray(entry.data) &&
      entry.data.length > 0,
  );
}

const ChartCard = ({
  title,
  subtitle,
  type,
  series,
  options = {},
  height = 350,
  badgeText,
  showUpdateDate = true,
  className = "",
}: ChartCardProps) => {
  const canRenderChart = hasRenderableSeries(series);

  // Configuración base que se fusionará con las opciones personalizadas
  const baseOptions: ApexOptions = {
    chart: {
      type,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: {
      enabled: type !== "pie" && type !== "donut",
      style: {
        fontSize: "12px",
        colors: ["#374151"],
      },
    },
    colors: ["#6366F1", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} pts`,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
        },
      },
    ],
    ...options, // Sobrescribe las opciones base con las personalizadas
  };

  return (
    <div
      className={`min-w-0 w-full border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {badgeText && (
          <div className="flex items-center">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {canRenderChart ? (
        <div
          className="relative"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          <ChartErrorBoundary title={title}>
            <Chart
              type={type}
              series={series}
              options={baseOptions}
              height="100%"
            />
          </ChartErrorBoundary>
        </div>
      ) : (
        <div
          className="relative flex items-center justify-center text-sm text-gray-400"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          Sin datos disponibles
        </div>
      )}

      {showUpdateDate && (
        <div className="mt-3 text-xs text-gray-500 text-right">
          Actualizado: {new Date().toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ChartCard;

