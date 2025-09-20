const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const api = {
    // Auth endpoints
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    // Players endpoints  
    getPlayers: async () => {
        const response = await fetch(`${API_BASE_URL}/players`);
        return response.json();
    },

    // Contact form
    sendContact: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return response.json();
    }
};