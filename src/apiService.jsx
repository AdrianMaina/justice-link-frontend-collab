// This service will centralize all our API calls

const API_URL = 'http://127.0.0.1:5000/api';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const request = async (endpoint, method = 'GET', data = null) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const responseData = await response.json();

        if (!response.ok) {
            // Throw an error with the message from the backend
            throw new Error(responseData.message || 'An unknown error occurred.');
        }

        return responseData;
    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

export const apiService = {
    // Auth
    login: (credentials) => request('/auth/login', 'POST', credentials),
    signup: (userData) => request('/auth/signup', 'POST', userData),
    googleLogin: (token) => request('/auth/google-login', 'POST', { token }),

    // Home
    getHomeSummary: () => request('/home_summary'),

    // Reports
    createReport: (reportData) => request('/reports', 'POST', reportData),
    getMyReports: () => request('/my_reports'), // THIS IS THE MISSING FUNCTION

    // News
    getNews: () => request('/news'),
    
    // Admin
    getReports: () => request('/reports'), // This is for admin to get all reports
    getAllUsers: () => request('/admin/users'),
    verifyReport: (id) => request(`/admin/reports/verify/${id}`, 'PUT'),
    rejectReport: (id) => request(`/admin/reports/reject/${id}`, 'PUT'),
    createNewsArticle: (articleData) => request('/admin/news', 'POST', articleData),
    updateNewsArticle: (id, articleData) => request(`/admin/news/${id}`, 'PUT', articleData),
    deleteNewsArticle: (id) => request(`/admin/news/${id}`, 'DELETE'),
};