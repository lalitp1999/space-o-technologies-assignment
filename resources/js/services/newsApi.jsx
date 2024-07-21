import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Handle response and error globally
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API call error:', error);
        return Promise.reject(error);
    }
);

/**
 * Fetch articles from the API.
 * 
 * @param {number} page - The page number.
 * @param {string} query - The search query.
 * @param {string} sortBy - The column to sort by.
 * @param {string} sortOrder - The sort order.
 * @returns {Promise<Object>} - The API response.
 */
export const fetchArticles = (page, query, sortBy, sortOrder) => {
    return api.post('/news', {
        page,
        q: query,
        sortBy,
        sortOrder,
    });
};

export default api;
