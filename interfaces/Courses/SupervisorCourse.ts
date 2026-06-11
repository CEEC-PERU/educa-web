export interface CourseStat {
  count: number;
  percent: string;
}

export interface CourseStudentAvatar {
  profile_picture: string;
  name: string;
}

export interface SupervisorCourse {
  course_id: number;
  name: string;
  description_short: string;
  image: string;
  studentCount: number;
  noProgress: CourseStat;
  inProgress: CourseStat;
  completed: CourseStat;
  approved: CourseStat;
  students: CourseStudentAvatar[];
}
