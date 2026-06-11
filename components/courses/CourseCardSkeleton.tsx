import React from "react";

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-gray-200" />
      <div className="flex flex-col flex-1 px-4 pt-4 pb-0 gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="px-4 pt-3 pb-4 mt-3 border-t border-gray-100">
        <div className="h-9 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
