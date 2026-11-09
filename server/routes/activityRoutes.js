const express = require('express');
const router = express.Router();

const Activity = require('../models/ActivityModel');

// CREATE Activity
router.post('/', async (req, res) => {
    try {
        const activity = new Activity(req.body);
        const savedActivity = await activity.save();

        res.status(201).json(savedActivity);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET All Activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE Activity
router.put('/:id', async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedActivity) {
            return res.status(404).json({
                message: 'Activity not found'
            });
        }

        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE Activity
router.delete('/:id', async (req, res) => {
    try {
        const deletedActivity = await Activity.findByIdAndDelete(
            req.params.id
        );

        if (!deletedActivity) {
            return res.status(404).json({
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;