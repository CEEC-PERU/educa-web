export interface UserCount {
    enterpriseName: string;
    maxUserCount: string;
    UserCount : number;
    mesage : string;
}


export interface GetCoursesByUserResponse {
    success: boolean;
    data: {
      totalCourses: number;
      completedCourses: number;
    };
  }