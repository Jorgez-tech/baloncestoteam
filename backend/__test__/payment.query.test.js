const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../models/payment_obligation.model');
jest.mock('../models/member.model');
jest.mock('../models/guardian_link.model');
jest.mock('../src/modules/sports/services/sports.service', () => ({
    getActiveRosterBillingSnapshot: jest.fn(),
    getActiveRosterPlayerIds: jest.fn()
}));

const PaymentObligation = require('../models/payment_obligation.model');
const paymentService = require('../src/modules/payments/services/payment.service');
const { listMemberObligationsDto } = require('../src/modules/payments/dtos/payment.dto');

const buildChainableQuery = () => {
    const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    };
    return query;
};

const buildDtoApp = () => {
    const app = express();
    app.get('/obligations/:memberId', listMemberObligationsDto, (req, res) => {
        res.json({ validatedQuery: req.validatedQuery });
    });
    return app;
};

describe('listMemberObligationsDto (M-03)', () => {
    let app;

    beforeAll(() => {
        app = buildDtoApp();
    });

    it('normalizes and whitelists the accepted query params', async () => {
        const response = await request(app).get(
            '/obligations/abc?page=1&limit=10&status=pending&type=mensualidad&period=2026-10&unexpected=hack'
        );

        expect(response.status).toBe(200);
        expect(response.body.validatedQuery).toEqual({
            page: 1,
            limit: 10,
            status: 'pending',
            type: 'mensualidad',
            period: '2026-10',
        });
    });

    it('rejects a limit outside the 1-100 range', async () => {
        const response = await request(app).get('/obligations/abc?limit=0');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('rejects an unknown obligation status', async () => {
        const response = await request(app).get('/obligations/abc?status=refunded');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});

describe('paymentService.getMemberObligations pagination contract (Zero Regression)', () => {
    const memberId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the full list (no skip/limit) when no limit is provided', async () => {
        const query = buildChainableQuery();
        PaymentObligation.find.mockReturnValue(query);

        await paymentService.getMemberObligations(memberId);

        expect(PaymentObligation.find).toHaveBeenCalledWith({ memberId });
        expect(query.skip).not.toHaveBeenCalled();
        expect(query.limit).not.toHaveBeenCalled();
    });

    it('applies skip/limit and filters only when provided', async () => {
        const query = buildChainableQuery();
        PaymentObligation.find.mockReturnValue(query);

        await paymentService.getMemberObligations(memberId, {
            page: 3,
            limit: 5,
            status: 'pending',
            type: 'mensualidad',
            period: '2026-10',
        });

        expect(PaymentObligation.find).toHaveBeenCalledWith({
            memberId,
            status: 'pending',
            type: 'mensualidad',
            period: '2026-10',
        });
        expect(query.skip).toHaveBeenCalledWith(10);
        expect(query.limit).toHaveBeenCalledWith(5);
    });
});
