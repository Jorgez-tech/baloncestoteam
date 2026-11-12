jest.mock('../models/audit_log.model');

const AuditLog = require('../models/audit_log.model');
const auditService = require('../src/modules/audit/services/audit.service');

const createFindQuery = (items) => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(items)
});

describe('AuditService.queryLogs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the paginated audit trail sorted with the newest event first', async () => {
        const items = [{ _id: 'log-1', action: 'LOGIN_SUCCESS' }];
        const query = createFindQuery(items);
        AuditLog.find.mockReturnValue(query);
        AuditLog.countDocuments.mockResolvedValue(41);

        const result = await auditService.queryLogs();

        expect(AuditLog.find).toHaveBeenCalledWith({});
        expect(query.sort).toHaveBeenCalledWith({ timestamp: -1 });
        expect(query.skip).toHaveBeenCalledWith(0);
        expect(query.limit).toHaveBeenCalledWith(20);
        expect(AuditLog.countDocuments).toHaveBeenCalledWith({});
        expect(result).toEqual({ items, total: 41, page: 1, limit: 20, totalPages: 3 });
    });

    it('builds the filter from action, target entity and actor', async () => {
        const query = createFindQuery([]);
        AuditLog.find.mockReturnValue(query);
        AuditLog.countDocuments.mockResolvedValue(0);

        const actorId = '64f1234567890abcdef12345';
        await auditService.queryLogs({ action: 'MEMBER_UPDATED', targetEntity: 'Member', actorId });

        expect(AuditLog.find).toHaveBeenCalledWith({
            action: 'MEMBER_UPDATED',
            targetEntity: 'Member',
            actorId
        });
    });

    it('filters by the event timestamp range when dates are provided', async () => {
        const query = createFindQuery([]);
        AuditLog.find.mockReturnValue(query);
        AuditLog.countDocuments.mockResolvedValue(0);

        const from = new Date('2026-10-01T00:00:00.000Z');
        const to = new Date('2026-10-31T23:59:59.000Z');
        await auditService.queryLogs({ from, to });

        expect(AuditLog.find).toHaveBeenCalledWith({ timestamp: { $gte: from, $lte: to } });
    });

    it('computes the page offset and clamps the page size', async () => {
        const query = createFindQuery([]);
        AuditLog.find.mockReturnValue(query);
        AuditLog.countDocuments.mockResolvedValue(0);

        const result = await auditService.queryLogs({ page: 3, limit: 500 });

        expect(query.skip).toHaveBeenCalledWith(200);
        expect(query.limit).toHaveBeenCalledWith(100);
        expect(result.page).toBe(3);
        expect(result.limit).toBe(100);
    });
});
