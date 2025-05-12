const mongoose = require("mongoose");

const CareerSuggestionSchema = new mongoose.Schema({
    student_id: { type: String, required: true },
    country: { type: String, required: true },
    assessment_result: { type: String, required: true },
    career_options: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CareerSuggestion", CareerSuggestionSchema);
