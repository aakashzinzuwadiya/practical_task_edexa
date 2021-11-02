const mongoose = require('mongoose');

const tipsSchema = new mongoose.Schema({
    place: { type: String, required:true, trim: true },
    totalAmount: { type: Number, required:true },
    tipPercentage: { type: Number, required:true }
}, {
    timestamps: true
});

module.exports = mongoose.model('tips', tipsSchema);