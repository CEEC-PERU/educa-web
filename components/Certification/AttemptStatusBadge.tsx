import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface AttemptStatusBadgeProps {
  status: "in_progress" | "completed" | "abandoned";
  score?: number;
  passed?: boolean;
}

export const AttemptStatusBadge: React.FC<AttemptStatusBadgeProps> = ({
  status,
  score,
  passed,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return passed
          ? {
              icon: CheckCircleIcon,
              color: "text-green-600 bg-green-50 border-green-200",
              text: "Aprobado",
              scoreText: `${score} pts`,
            }
          : {
              icon: XCircleIcon,
              color: "text-red-600 bg-red-50 border-red-200",
              text: "Reprobado",
              scoreText: `${score} pts`,
            };

      case "abandoned":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          text: "Abandonado",
          scoreText: "No completado",
        };

      case "in_progress":
        return {
          icon: ClockIcon,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          text: "En progreso",
          scoreText: "En curso",
        };

      default:
        return {
          icon: ClockIcon,
          color: "text-gray-600 bg-gray-50 border-gray-200",
          text: "Desconocido",
          scoreText: "N/A",
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.color}`}
    >
      <IconComponent className="h-4 w-4" />
      <span className="text-sm font-medium">{config.text}</span>
      <span className="text-xs opacity-75">{config.scoreText}</span>
    </div>
  );
};
