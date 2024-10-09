export interface RequestCuestionario {
    user_id: number;
    score:number;
    course_id: number;
    cuestype_id: number;
}


export interface ResponseCuestionario {
    result_id:number;
    user_id: number;
    score:number;
    course_id: number;
    cuestype_id: number;
    created_at:Date;
    updated_at :Date;
}
