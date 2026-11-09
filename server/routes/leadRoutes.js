const express = require('express');
const router = express.Router();

const Lead = require('../models/LeadModel');

// 1. Add Lead
router.post('/', async (req, res) => {
    try {
        const { name, email, status } = req.body;

        const lead = new Lead({
            name,
            email,
            status
        });

        await lead.save();

        res.status(201).json({
            message: 'Lead added successfully',
            lead
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. Get All Leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();

        res.status(200).json(leads);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. Update Lead
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found'
            });
        }

        res.status(200).json({
            message: 'Lead updated successfully',
            lead
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. Delete Lead
router.delete('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found'
            });
        }

        res.status(200).json({
            message: 'Lead deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
