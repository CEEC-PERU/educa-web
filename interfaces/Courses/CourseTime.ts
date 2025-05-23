export interface CourseTime{
    course_id : number;
    user_id :number;
    startTime : Date;
    endTime :  Date | null;
    duration : number;
  }

  export interface CourseTimeEnd{
    user_id :number;
    course_id : number;
    endTime :  Date;
  }
