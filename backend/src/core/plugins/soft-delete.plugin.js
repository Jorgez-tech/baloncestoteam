/**
 * Soft deletion plugin for core entities (Club, Category, Team, Member, User) and for
 * entities referenced by them (Player, via the roster).
 *
 * Core entities must never be physically removed from MongoDB: deleting a team
 * would leave orphan rosters and payment obligations behind. This plugin:
 *  - adds the `isDeleted` / `deletedAt` flags required by the core rules;
 *  - excludes soft-deleted documents from reads by default;
 *  - blocks hard deletes at the model level;
 *  - exposes explicit soft deletion methods instead of hard deletes.
 *
 * Documents created before this plugin existed have no `isDeleted` field, so the
 * default filter uses `$ne: true` (not `false`) to keep them visible.
 */

const applyNotDeletedFilter = function (next) {
    const options = this.getOptions ? this.getOptions() : {};

    if (options.withDeleted) {
        return next();
    }

    this.where({ isDeleted: { $ne: true } });
    return next();
};

/**
 * Hard deletes are forbidden on core entities: they are what leaves orphan rosters,
 * memberships and payment obligations behind. Scripts that legitimately wipe a
 * whitelisted database must go through the raw driver (`Model.collection.deleteMany`).
 */
const blockHardDelete = function (next) {
    const modelName = this.model ? this.model.modelName : 'Core entity';
    const error = new Error(
        `El borrado físico está prohibido en entidades core (${modelName}). Use softDelete()/softDeleteById() en su lugar.`
    );
    error.statusCode = 409;
    error.code = 'HARD_DELETE_FORBIDDEN';
    return next(error);
};

const softDeletePlugin = (schema) => {
    schema.add({
        isDeleted: { type: Boolean, default: false, index: true },
        deletedAt: { type: Date, default: null }
    });

    // Reads and updates automatically ignore soft-deleted documents.
    schema.pre(/^find/, applyNotDeletedFilter);
    schema.pre('countDocuments', applyNotDeletedFilter);
    schema.pre('updateOne', applyNotDeletedFilter);
    schema.pre('updateMany', applyNotDeletedFilter);

    // Physical removal is blocked at the model level, so it cannot be reintroduced by accident.
    schema.pre('deleteOne', { query: true, document: false }, blockHardDelete);
    schema.pre('deleteMany', { query: true, document: false }, blockHardDelete);
    schema.pre('findOneAndDelete', { query: true, document: false }, blockHardDelete);

    schema.methods.softDelete = function () {
        this.isDeleted = true;
        this.deletedAt = new Date();
        return this.save();
    };

    schema.methods.restore = function () {
        this.isDeleted = false;
        this.deletedAt = null;
        return this.save();
    };

    schema.statics.softDeleteById = function (id) {
        return this.findOneAndUpdate(
            { _id: id },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );
    };

    schema.statics.softDeleteMany = function (filter = {}) {
        return this.updateMany(filter, { $set: { isDeleted: true, deletedAt: new Date() } });
    };

    // Escape hatch for admin tooling and migrations that need to inspect everything.
    schema.statics.findWithDeleted = function (filter = {}) {
        return this.find(filter, null, { withDeleted: true });
    };
};

module.exports = softDeletePlugin;
