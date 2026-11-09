const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true
},

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    value: {
        type: Number,
        required: true,
        min: 0
    },

    stage: {
        type: String,
        enum: [
            'New',
            'Qualified',
            'Proposal',
            'Negotiation',
            'Won',
            'Lost'
        ],
        default: 'New'
    },

    expectedCloseDate: {
        type: Date,
        default: null
    },

    description: {
        type: String,
        default: '',
        trim: true
    }
},
{
    timestamps: true
}


);

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
