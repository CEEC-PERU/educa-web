export const baseURL = `https://educa-web-api.onrender.com`;

// authentication
export const API_AUTH = `${baseURL}/api/auth/signin`;

// courses
export const API_COURSES = `${baseURL}/api/courses`;

// categories
export const API_CATEGORIES = `${baseURL}/api/categories`;

// professors
export const API_PROFESSORS = `${baseURL}/api/professors`;

//levels
export const API_LEVELS = `${baseURL}/api/professors/levels`;

// Modules
export const API_MODULES = `${baseURL}/api/modules`;

// Sessions
export const API_SESSIONS = `${baseURL}/api/sessions`;

//evaluations
export const API_EVALUATIONS = `${baseURL}/api/evaluations`;

export const API_QUESTION_TYPES = `${baseURL}/api/questions/types`;

// Questions
export const API_QUESTIONS = `${baseURL}/api/questions`;

// Options
export const API_OPTIONS = `${baseURL}/api/options`;

// videos
export const API_VIDEOS = `${baseURL}/api/videos`;


// images
export const API_IMAGES = `${baseURL}/api/images`;

//socket
export const API_SOCKET_URL = `http://localhost:4100`;

//perfil
export const API_PROFILE = `${baseURL}/api/profiles/profiles`;

//sesiones que ingreso 
export const API_APPSESSION = `${baseURL}/api/appsession`;


//obtener info de usuarios 
export const API_GET_PROFILE_BY_USER = `${baseURL}/api/profiles/alldata`;


//obtener info de empresa por usuario
export const API_GET_EMPRESA_BY_USER = `${baseURL}/api/users/enterprise`;

//actualizar perfil por user_id
export const API_PUT_PROFILE = `${baseURL}/api/profiles`;

//obtener cursos asignados al estudinate
export const API_GET_COURSESTUDENT= `${baseURL}/api/coursestudents/cursos`;

//obtener cursos asignados al estudinate
export const API_GET_COURSESTUDENT_ENTERPRISE= `${baseURL}/api/coursestudents/enterprise`;

export const API_GET_COURSESTUDENTS= `${baseURL}/api/coursestudents/students`;

export const API_GET_COURSESTUDENT_ASSIGNED= `${baseURL}/api/courseStudents/assigned`;

export const API_POST_COURSESTUDENT= `${baseURL}/api/coursestudents/assign`;
//obtener detalle d elos cursos
export const API_GET_DETAILCOURSE = `${baseURL}/api/coursestudents/detailcourse`;


//obtener info de empresas
export const API_GET_EMPRESA = `${baseURL}/api/enterprises`;

//crear usuarios
export const API_USERS = `${baseURL}/api/superadmin/import`;

//users
export const API_USER = `${baseURL}/api/superadmin`;

//obtener info de empresas 
export const API_GET_ENTERPRISE = `${baseURL}/api/enterprises`;

export const API_GET_USERS_BY_ENTERPRISE  = `${baseURL}/api/superadmin/enterprise`;

export const API_REQUIREMENTS  = `${baseURL}/api/requirements`;

//Obtener modulos , sesiones , evaluacion y prox evaluacion_final
export const API_GET_MODULESDETAIL = `${baseURL}/api/coursestudents/modules`;

export const API_POST_SESSION_PROGRESS = `${baseURL}/api/userSessionProgress`;

export const API_POST_MODULE_PROGRESS =  `${baseURL}/api/userModuleProgress`;

export const API_GET_PROGRESS_SESSION_BYUSER =  `${baseURL}/api/userSessionProgress/progress/user`;

export const API_PUT_PROGRESS_SESSION_BYUSER =  `${baseURL}/api/userSessionProgress/progress/user`;

//PRUEBA
export const API_POST_MODULE_RESULT =  `${baseURL}/api/moduleresults`;

export const API_POST_COURSE_RESULT =  `${baseURL}/api/courseresults`;


