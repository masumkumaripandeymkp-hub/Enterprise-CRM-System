const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        status: {
            type: String,
            enum: ['New', 'Contacted', 'Negotiation', 'Won'],
            default: 'New'
        }
    },
    {
        timestamps: true
    }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;

