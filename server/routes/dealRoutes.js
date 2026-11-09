const express = require('express');
const router = express.Router();

const Deal = require('../models/DealModel');

// 1. Add New Deal
router.post('/', async (req, res) => {
try {
const {
title,
customerName,
value,
stage,
expectedCloseDate,
description
} = req.body;

    const deal = new Deal({
        title,
        customerName,
        value,
        stage,
        expectedCloseDate,
        description
    });

    await deal.save();

    res.status(201).json({
        message: 'Deal added successfully',
        deal
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}


});

// 2. Get All Deals
router.get('/', async (req, res) => {
try {
const deals = await Deal.find().sort({ createdAt: -1 });

    res.status(200).json(deals);

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}


});

// 3. Update Deal
router.put('/:id', async (req, res) => {
try {
const deal = await Deal.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true
}
);

    if (!deal) {
        return res.status(404).json({
            message: 'Deal not found'
        });
    }

    res.status(200).json({
        message: 'Deal updated successfully',
        deal
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}


});

// 4. Delete Deal
router.delete('/:id', async (req, res) => {
try {
const deal = await Deal.findByIdAndDelete(req.params.id);


    if (!deal) {
        return res.status(404).json({
            message: 'Deal not found'
        });
    }

    res.status(200).json({
        message: 'Deal deleted successfully'
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}


});

module.exports = router;
