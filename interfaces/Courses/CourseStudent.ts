export interface CourseProfessor{
  full_name : string;
}
export interface CourseCategory{
    name : string;
    category_id : number;

}
export interface Content{
  content_id : number;
  name  : string;
}

export interface Course{
    name : string;
    course_id : number;
    description_short : string;
    image : string,
    courseCategory : CourseCategory,
    courseProfessor : CourseProfessor
  }

export interface CourseStudent{
    course_id : number;
    deadline : Date,
    Course : Course,
  }

export interface CourseStudentProps{
  course_id : number | undefined ;
  name : string | undefined;
  description: string | undefined;
  profesor : string | undefined;
  image : string | undefined,
  categoria:string | undefined
}
