const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';



const getToken = () => localStorage.getItem('token');

const publicFetch = async (path) => {
    const res = await fetch(`${API_URL}${path}`);
    if(!res.ok) return{error : res.statusText};
    return res.json();
};

const adminFetch = async (path, method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${API_URL}${path}`, options);
    return res.json();
};


//  AUTH 

export const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const logout = async () => {
    await adminFetch('/api/auth/logout', 'POST');
    localStorage.removeItem('token');
};

export const getSession = () => adminFetch('/api/auth/session');


// EVENTS 

export const getEvents = () => publicFetch('/api/events');

export const getFeaturedEvent = () => publicFetch('/api/events/featured');

export const createEvent = (data) => adminFetch('/api/events', 'POST', data);

export const updateEvent = (id, data) => adminFetch(`/api/events/${id}`, 'PUT', data);

export const deleteEvent = (id) => adminFetch(`/api/events/${id}`, 'DELETE');


// ARTICLES 

export const getArticle = () => publicFetch('/api/articles');

export const createArticle = (data) => adminFetch('/api/articles', 'POST', data);

export const updateArticle = (id, data) => adminFetch(`/api/articles/${id}`, 'PUT', data);

export const deleteArticle = (id) => adminFetch(`/api/articles/${id}`, 'DELETE');


// YOUTUBE VIDEOS

export const getYoutubeVideos = () => publicFetch('/api/youtube-videos');

export const createYoutubeVideo = (data) => adminFetch('/api/youtube-videos', 'POST', data);

export const updateYoutubeVideo = (id, data) => adminFetch(`/api/youtube-videos/${id}`, 'PUT', data);

export const deleteYoutubeVideo = (id) => adminFetch(`/api/youtube-videos/${id}`, 'DELETE');


// WORKSHOPS 

export const getWorkshops = () => publicFetch('/api/workshops');

export const getWorkshopsByCategory = (category) => publicFetch(`/api/workshops?category=${category}`);

export const createWorkshop = (data) => adminFetch('/api/workshops', 'POST', data);

export const updateWorkshop = (id, data) => adminFetch(`/api/workshops/${id}`, 'PUT', data);

export const deleteWorkshop = (id) => adminFetch(`/api/workshops/${id}`, 'DELETE');


// SITE SETTINGS

export const getSettings = () => publicFetch('/api/settings');

export const updateSetting = (key, data) => adminFetch(`/api/settings/${key}`, 'PUT', data);


// TEAM

export const getTeam = () => publicFetch('/api/team');

export const createMember = (data) => adminFetch('/api/team', 'POST', data);

export const updateMember = (id, data) => adminFetch(`/api/team/${id}`, 'PUT', data);

export const deleteMember = (id) => adminFetch(`/api/team/${id}`, 'DELETE');
