const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['Meeting', 'Phone Call', 'Email', 'Follow-up', 'Other'],
            default: 'Meeting'
        },
        relatedTo: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        notes: {
            type: String,
            default: '',
            trim: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;