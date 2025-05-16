
export interface ProfesorLevel{
    name : string
}

export interface CourseProfessor{
    full_name : string;
    image: string;
    especialitation : string;
    description : string;
    professorLevel : ProfesorLevel
}

export interface CourseCategory{
    name : string
}

export interface ModuleSessions{
    name : string,

}

export interface CourseModules{
    name : string,
    is_active: string,
    module_id : number,
    moduleSessions :ModuleSessions[],
}

export interface CourseDetail{
    course_id : number;
    name : string;
    description_short : string;
    description_large : string;
    intro_video : string;
    duration_video : string;
    image:string;
    duration_course: string;
    is_active : boolean;
    courseCategory : CourseCategory;
    courseProfessor : CourseProfessor;
    courseModules: CourseModules[];
  }
