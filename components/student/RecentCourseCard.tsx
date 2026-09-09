import React from "react";
import { Clock } from "lucide-react";
import { formatDuration, formatRelativeTime } from "../../utils/formatDuration";

interface RecentCourseCardProps {
  course_id: number;
  name: string;
  image: string;
  categoria?: string | null;
  lastViewedAt: string;
  totalDurationSeconds: number;
  progress: number;
  onClick: () => void;
}

const RecentCourseCard: React.FC<RecentCourseCardProps> = ({
  name,
  image,
  categoria,
  lastViewedAt,
  totalDurationSeconds,
  progress,
  onClick,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress ?? 0));

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:bg-white/10"
    >
      <img
        className="w-full h-56 sm:h-48 lg:h-44 object-cover object-top"
        src={image}
        alt={name}
      />
      <div className="px-4 py-3 flex flex-col gap-1">
        {categoria && (
          <span className="inline-block w-fit bg-brandrosado-800/20 text-brandrosado-800 rounded-full font-semibold text-xs px-3 py-1">
            {categoria}
          </span>
        )}
        <div className="font-bold text-md text-white line-clamp-1 mt-1">
          {name}
        </div>
        <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(totalDurationSeconds)}</span>
          <span>&middot;</span>
          <span>{formatRelativeTime(lastViewedAt)}</span>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>Progreso</span>
            <span>{clampedProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brandrosado-800"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentCourseCard;
