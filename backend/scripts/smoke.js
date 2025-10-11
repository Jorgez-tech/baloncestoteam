const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function main() {
    const results = [];

    const push = (name, status, detail = null) => {
        results.push({ name, status, detail });
    };

    try {
        const health = await axios.get(`${BASE_URL}/health`);
        push('health', 'ok', health.data);
    } catch (error) {
        push('health', 'fail', error.message);
    }

    const email = `smoke_${Date.now()}@example.com`;
    const password = 'Secret123';

    try {
        const register = await axios.post(`${BASE_URL}/api/v1/auth/register`, { email, password });
        push('register', 'ok', register.data);
    } catch (error) {
        push('register', 'fail', error.response?.data || error.message);
    }

    let userToken = null;
    try {
        const login = await axios.post(`${BASE_URL}/api/v1/auth/login`, { email, password });
        userToken = login.data.token;
        push('login_user', 'ok', { user: login.data.user.email });
    } catch (error) {
        push('login_user', 'fail', error.response?.data || error.message);
    }

    try {
        const players = await axios.get(`${BASE_URL}/api/v1/players`);
        push('players_public', 'ok', { count: players.data?.data?.length ?? players.data?.length });
    } catch (error) {
        push('players_public', 'fail', error.response?.data || error.message);
    }

    // Admin flows
    let adminToken = null;
    try {
        const adminLogin = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
            email: 'admin@basketballteam.com',
            password: 'admin123',
        });
        adminToken = adminLogin.data.token;
        push('login_admin', 'ok', { user: adminLogin.data.user.email });
    } catch (error) {
        push('login_admin', 'fail', error.response?.data || error.message);
    }

    if (adminToken) {
        try {
            const payload = {
                name: `Smoke Player ${crypto.randomInt(1000, 9999)}`,
                position: 'Point Guard',
                jersey_number: crypto.randomInt(1, 99),
                height: 190,
                weight: 85,
                age: 24,
                user_id: '6864e33cdc46aea71914609d',
            };
            const created = await axios.post(`${BASE_URL}/api/v1/players`, payload, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            push('create_player', 'ok', { id: created.data?.data?._id });
        } catch (error) {
            push('create_player', 'fail', error.response?.data || error.message);
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
    console.error('SMOKE_ERROR', error.message);
    process.exitCode = 1;
});
