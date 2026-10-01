const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        duration: { type: Number, required: true, min: 1 }, // Duration in minutes
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

const Practice = mongoose.models.Practice || mongoose.model('Practice', practiceSchema);

module.exports = Practice;
