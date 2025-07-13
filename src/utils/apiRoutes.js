const BASE_URL = process.env.REACT_APP_API_URL;

const apiRoutes = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
  leave: {
    add: `${BASE_URL}/leaves`,
    edit: (id) => (id ? `${BASE_URL}/leaves/${id}` : null),
    myleaves: `${BASE_URL}/leaves`,
    allFilter: `${BASE_URL}/leaves/filter/all`,
    teamLeave: (id) =>
      id ? `${BASE_URL}/leaves/filter/teamLeave/${id}` : null,
    approve: (id) => (id ? `${BASE_URL}/leaves/${id}/apporve` : null),
    reject: (id) => (id ? `${BASE_URL}/leaves/${id}/decline` : null),
    history: (id) => (id ? `${BASE_URL}/leavehistory/${id}` : null),
    delete: (id) => (id ? `${BASE_URL}/leaves/${id}` : null),
  },
  user: {
    add: `${BASE_URL}/user`,
    edit: (id) => (id ? `${BASE_URL}/user/${id}` : null),
    myteam: (id) => (id ? `${BASE_URL}/user/filter/by-manager/${id}` : null),
    allFilter: `${BASE_URL}/user/filter`,
    getManager: `${BASE_URL}/user/managers`,
    delete: (id) => (id ? `${BASE_URL}/user/${id}` : null),
  },
};

export default apiRoutes;
