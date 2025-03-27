// export const baseUrl = "http://139.59.16.130:3010/";
// export const baseUrl = "http://localhost:3010/";
export const baseUrl = "https://eventify-backend-a53t.onrender.com/";

export const getCompanySnippets = baseUrl + "companySnippets";
export const addCompanySnippet = baseUrl + "companySnippets";
export const deleteCompanySnippet = (id) => baseUrl + `companySnippets/${id}`;
export const editCompanySnippet = (id) => baseUrl + `companySnippets/${id}`;

export const addSystemUser = baseUrl + "users";
export const getSystemUsers = baseUrl + "users";
export const deleteSystemUser = (id) => baseUrl + `users/${id}`;
export const editSystemUserAPI = (id) => baseUrl + `users/${id}`;

export const addProject = baseUrl + "projects";
export const getAllProjectsAPI = baseUrl + "projects";
export const deleteProjects = (id) => baseUrl + `projects/${id}`;

export const addProjectCommunicationAPI = baseUrl + "projectcommunications";
export const getALLProjectCommunicationAPI = baseUrl + "projectcommunications";
export const deleteProjectCommunicationAPI = (id) => baseUrl + `projectcommunications/${id}`;

export const getAllTicketsAPi = baseUrl + "tickets";
export const editTicketAPI = baseUrl + "tickets";
export const addTicketsAPI = baseUrl + "tickets";
export const deleteTicketAPI = (id) => baseUrl + `tickets/${id}`;

export const addCompanyAPI = baseUrl + "companies";
export const getCompaniesAPI = baseUrl + "companies";
export const deleteCompanyAPI = (id) => baseUrl + `companies/${id}`;

export const getAllClientUsersAPI = baseUrl + "users";

export const loginAPI = baseUrl + "users/login";

//apis

export const getFacultyAPI = baseUrl + 'users'
export const deleteFacultyAPI = (id) => baseUrl + `users/${id}`

export const registerUser = baseUrl + `users/register`;

export const addCourseAPI = baseUrl + 'courses'
export const getCourseAPI = baseUrl + 'courses'
export const deleteCourseAPI = (id) => baseUrl + `courses/${id}`

export const addStudentAPI = baseUrl + 'students/register'
export const getStudentAPI = baseUrl + 'students'
export const deleteStudentAPI = (id) => baseUrl + `students/${id}`


export const getActivitiesAPI = baseUrl + 'activities'
export const addActivitesAPI = baseUrl + 'activities'

export const generateEvents = baseUrl + 'events/generate'
export const addEvents = baseUrl + 'events'
export const getEvents = baseUrl + 'events'
export const registerEventAPI = (id) => baseUrl + `events/register/${id}`
export const inviteEventAPI = (id) => baseUrl + `events/invite/${id}`
