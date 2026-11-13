const express = require('express');
const request = require('supertest');

jest.mock('../models/user.model');

const User = require('../models/user.model');
const userService = require('../src/modules/users/services/user.service');
const { listUsersDto } = require('../src/modules/users/dtos/user.dto');

const buildChainableQuery = () => {
    const query = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    };
    return query;
};

const buildDtoApp = () => {
    const app = express();
    app.get('/users', listUsersDto, (req, res) => {
        res.json({ validatedQuery: req.validatedQuery });
    });
    return app;
};

describe('listUsersDto (M-03)', () => {
    let app;

    beforeAll(() => {
        app = buildDtoApp();
    });

    it('normalizes and whitelists the accepted query params', async () => {
        const response = await request(app).get(
            '/users?page=2&limit=25&role=admin&isActive=true&search=ana&unexpected=hack'
        );

        expect(response.status).toBe(200);
        expect(response.body.validatedQuery).toEqual({
            page: 2,
            limit: 25,
            role: 'admin',
            isActive: true,
            search: 'ana',
        });
    });

    it('rejects a limit outside the 1-100 range', async () => {
        const response = await request(app).get('/users?limit=500');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('rejects an unknown role', async () => {
        const response = await request(app).get('/users?role=superuser');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('accepts a request without query params', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body.validatedQuery).toEqual({});
    });
});

describe('userService.listUsers pagination contract (Zero Regression)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the full list (no skip/limit) when no limit is provided', async () => {
        const query = buildChainableQuery();
        User.find.mockReturnValue(query);

        await userService.listUsers();

        expect(query.skip).not.toHaveBeenCalled();
        expect(query.limit).not.toHaveBeenCalled();
    });

    it('applies skip/limit only when limit is provided', async () => {
        const query = buildChainableQuery();
        User.find.mockReturnValue(query);

        await userService.listUsers({ page: 2, limit: 10 });

        expect(query.skip).toHaveBeenCalledWith(10);
        expect(query.limit).toHaveBeenCalledWith(10);
    });

    it('maps the validated filters to the mongoose query', async () => {
        const query = buildChainableQuery();
        User.find.mockReturnValue(query);

        await userService.listUsers({ role: 'admin', isActive: true, search: 'ana' });

        expect(User.find).toHaveBeenCalledWith({
            role: 'admin',
            isActive: true,
            name: { $regex: 'ana', $options: 'i' },
        });
    });
});
