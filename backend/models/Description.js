const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    notes: { type: String },
});

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;
