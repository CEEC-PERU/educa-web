//export const baseURL = `https://educa-web-api.onrender.com`;

export const baseURL = `http://localhost:4100`;

// authentication datos
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

// imagenes
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
export const API_GET_COURSESTUDENT = `${baseURL}/api/coursestudents/cursos`;

export const API_GET_COURSEMODULE = `${baseURL}/api/coursestudents/modules`;

//obtener cursos asignados al estudiante
export const API_GET_COURSESTUDENT_ENTERPRISE = `${baseURL}/api/coursestudents/enterprise`;

export const API_GET_COURSESTUDENT_SUPERVISOR = `${baseURL}/api/coursestudents`;

export const API_GET_COURSESTUDENTS = `${baseURL}/api/coursestudents/students`;

export const API_GET_COURSESTUDENT_ASSIGNED = `${baseURL}/api/courseStudents/assigned`;

export const API_POST_COURSESTUDENT = `${baseURL}/api/coursestudents/assign`;
//obtener detalle d elos cursos

export const API_GET_DETAILCOURSE = `${baseURL}/api/coursestudents/detailcourse`;

//obtener info de empresas
export const API_GET_EMPRESA = `${baseURL}/api/enterprises`;

//crear usuarios
export const API_USERS = `${baseURL}/api/superadmin/import`;

//users
export const API_USER = `${baseURL}/api/superadmin`;

export const API_USERU = `${baseURL}/api/users`;

//obtener info de empresas
export const API_GET_ENTERPRISE = `${baseURL}/api/enterprises`;

export const API_GET_USERS_BY_ENTERPRISE = `${baseURL}/api/superadmin/enterprise`;

export const API_REQUIREMENTS = `${baseURL}/api/requirements`;

//Obtener modulos , sesiones , evaluacion y prox evaluacion_final
export const API_GET_MODULESDETAIL = `${baseURL}/api/coursestudents/modules`;

export const API_POST_SESSION_PROGRESS = `${baseURL}/api/userSessionProgress`;

export const API_POST_MODULE_PROGRESS = `${baseURL}/api/userModuleProgress`;

export const API_GET_PROGRESS_SESSION_BYUSER = `${baseURL}/api/userSessionProgress/progress/user`;

export const API_PUT_PROGRESS_SESSION_BYUSER = `${baseURL}/api/userSessionProgress/progress/user`;

//PRUEBA
export const API_POST_MODULE_RESULT = `${baseURL}/api/moduleresults`;

export const API_POST_COURSE_RESULT = `${baseURL}/api/courseresults`;

export const API_GET_COUNT_COURSE_CORPORATE = `${baseURL}/api/metricascorporate/corporate`;

export const API_GET_NOTAS = `${baseURL}/api/notas/courses`;

export const API_GET_NOTAS_USER_ID = `${baseURL}/api/notas/course`;

export const API_GET_NOTAS_EXCEL = `${baseURL}/api/notas/excel`;

export const API_GET_NOTAS_SUPERVISOR = `${baseURL}/api/notas/supervisor/notas`;

export const API_GET_NOTAS_SUPERVISOR_CLASSROOM = `${baseURL}/api/notas/supervisor/classrooms`;

export const API_USERCOUNT = `${baseURL}/api/enterprises/count`;

export const API_CLASSROOM = `${baseURL}/api/classrooms/enterprise`;

export const API_CLASSROOM_CREATE = `${baseURL}/api/classrooms`;

export const API_USERS_CREATE = `${baseURL}/api/users/bulk`;

export const API_USERS_COURSE_CREATE = `${baseURL}/api/users/courseusers`;

export const API_SHIFTS = `${baseURL}/api/shifts`;

export const API_COURSESTUDENT = `${baseURL}/api/courseenterprise/course/user`;

export const API_USER_INFO = `${baseURL}/api/userinfo/create`;

export const API_USER_INFO_SHOWMODAL = `${baseURL}/api/userinfo/modals`;

export const API_USER_CUESTIONARIO = `${baseURL}/api/cuestionarioresults`;

export const API_USER_FLASHCARDS = `${baseURL}/api/flashcards`;

export const API_USERS_COURSES = `${baseURL}/api/users/courses`;

export const API_DASHBOARD = `${baseURL}/api/dashboard`;

export const API_TEMPLATE = `${baseURL}/api/template`;

export const API_COURSETIME = `${baseURL}/api/coursetime`;

export const API_ANSWER_TEMPLATE = `${baseURL}/api/answertemplate`;

export const API_RESPONSE = `${baseURL}/api/resultado`;

//materiales
export const API_MATERIALS = `${baseURL}/api/coursematerials`;

export const API_STUDENT_EVALUATION = `${baseURL}/api/evaluations/assignment`;

export const API_EVALUATIONMODULE = `${baseURL}/api/evaluationsmodule`;
