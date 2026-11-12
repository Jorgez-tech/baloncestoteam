const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(60000);

const Club = require('../models/club.model');
const Category = require('../models/category.model');
const Team = require('../models/team.model');
const Member = require('../models/member.model');
const Player = require('../models/player.model');
const TeamPlayer = require('../models/team_player.model');
const PaymentObligation = require('../models/payment_obligation.model');
const User = require('../models/user.model');
const userService = require('../src/modules/users/services/user.service');
const playerService = require('../src/modules/players/services/player.service');
const memberService = require('../src/modules/members/services/member.service');

let mongoServer;

const clearDatabase = async () => {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(collections.map(collection => collection.deleteMany({})));
};

describe('Soft deletion plugin (integration)', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { dbName: 'soft_delete_test' });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    it('adds the isDeleted and deletedAt flags to core schemas', () => {
        [Club, Category, Team, Member, User, Player, PaymentObligation].forEach(model => {
            expect(model.schema.path('isDeleted')).toBeDefined();
            expect(model.schema.path('deletedAt')).toBeDefined();
        });
    });

    it('blocks physical removal of entities protected by the plugin', async () => {
        const club = await Club.create({ name: 'Club Protegido' });

        await expect(Club.findByIdAndDelete(club._id)).rejects.toMatchObject({
            code: 'HARD_DELETE_FORBIDDEN'
        });
        await expect(Club.deleteMany({})).rejects.toMatchObject({
            code: 'HARD_DELETE_FORBIDDEN'
        });

        const stillThere = await Club.findById(club._id);
        expect(stillThere).not.toBeNull();
    });

    it('refuses to physically remove a financial record', async () => {
        const obligation = await PaymentObligation.create({
            memberId: new mongoose.Types.ObjectId(),
            title: 'Mensualidad Septiembre 2026',
            type: 'mensualidad',
            period: '2026-09',
            amount: 15000,
            dueDate: new Date('2026-09-30T00:00:00.000Z')
        });

        await expect(PaymentObligation.findByIdAndDelete(obligation._id)).rejects.toMatchObject({
            code: 'HARD_DELETE_FORBIDDEN'
        });

        const raw = await PaymentObligation.collection.findOne({ _id: obligation._id });
        expect(raw).not.toBeNull();
    });

    it('cancels unpaid fees when a member is deactivated instead of deleting them', async () => {
        const user = await User.create({ email: 'billing.member@example.com', password: 'secret123' });
        const member = await Member.create({
            userId: user._id,
            memberNumber: 'SOC-500',
            status: 'active'
        });
        const obligation = await PaymentObligation.create({
            memberId: member._id,
            title: 'Mensualidad Octubre 2026',
            type: 'mensualidad',
            period: '2026-10',
            amount: 15000,
            dueDate: new Date('2026-10-31T00:00:00.000Z')
        });

        await memberService.updateMember(member._id.toString(), { status: 'inactive' });

        const cancelledObligation = await PaymentObligation.findById(obligation._id);
        expect(cancelledObligation.status).toBe('cancelled');

        const raw = await PaymentObligation.collection.findOne({ _id: obligation._id });
        expect(raw).not.toBeNull();
    });

    it('hides soft-deleted documents from default reads but keeps them retrievable', async () => {
        const club = await Club.create({ name: 'Club Soft Deleted' });
        expect(club.isDeleted).toBe(false);

        await Club.softDeleteById(club._id);

        const visible = await Club.find({});
        expect(visible).toHaveLength(0);

        const all = await Club.findWithDeleted({});
        expect(all).toHaveLength(1);
        expect(all[0].deletedAt).toBeInstanceOf(Date);
    });

    it('keeps documents created before the plugin was introduced visible', async () => {
        await Club.collection.insertOne({
            name: 'Club Legado',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const clubs = await Club.find({});
        expect(clubs).toHaveLength(1);
        expect(clubs[0].name).toBe('Club Legado');
    });

    it('excludes soft-deleted documents from countDocuments and allows restoring them', async () => {
        const club = await Club.create({ name: 'Club Restaurable' });
        await club.softDelete();

        await expect(Club.countDocuments({})).resolves.toBe(0);

        await club.restore();
        await expect(Club.countDocuments({})).resolves.toBe(1);
    });

    it('performs a soft delete when removing a user instead of dropping the document', async () => {
        const user = await User.create({ email: 'soft.delete@example.com', password: 'secret123' });

        await userService.deleteUser(user._id);

        const raw = await User.collection.findOne({ _id: user._id });
        expect(raw).not.toBeNull();
        expect(raw.isDeleted).toBe(true);

        const visible = await User.find({ email: 'soft.delete@example.com' });
        expect(visible).toHaveLength(0);
    });

    it('soft-deletes a player and releases its active roster spots', async () => {
        const user = await User.create({ email: 'roster.owner@example.com', password: 'secret123' });
        const player = await Player.create({
            user_id: user._id,
            name: 'Jugador Baja',
            position: 'Center',
            height: 200,
            weight: 100
        });
        const rosterEntry = await TeamPlayer.create({
            teamId: new mongoose.Types.ObjectId(),
            playerId: player._id,
            status: 'Active'
        });

        await playerService.deletePlayer(player._id);

        await expect(Player.find({})).resolves.toHaveLength(0);

        const updatedRosterEntry = await TeamPlayer.findById(rosterEntry._id);
        expect(updatedRosterEntry.status).toBe('Inactive');
        expect(updatedRosterEntry.leftAt).toBeInstanceOf(Date);
    });
});
