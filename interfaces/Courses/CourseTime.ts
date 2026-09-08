export interface CourseTime {
  course_id: number;
  user_id: number;
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

export interface CourseTimeEnd {
  user_id: number;
  course_id: number;
  endTime: Date;
}

export interface CourseTimeAverage {
  course_id: number;
  course_name: string;
  average_time: number;
}

export interface RecentCourseTime {
  course_id: number;
  name: string;
  description_short: string;
  image: string;
  category_name: string | null;
  professor_name: string | null;
  last_viewed_at: string;
  total_duration_seconds: number;
  progress: number;
}

export interface CourseTimeTotal {
  total_duration_seconds: number;
  courses_count: number;
}

export interface CourseTimeSummary {
  recentCourses: RecentCourseTime[];
  totalTime: CourseTimeTotal;
}
