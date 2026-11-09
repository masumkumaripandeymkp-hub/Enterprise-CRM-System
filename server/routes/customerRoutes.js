const express = require('express');
const router = express.Router();

const Customer = require('../models/CustomerModel');

// 1. Add Customer
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company } = req.body;

        const customer = new Customer({
            name,
            email,
            phone,
            company
        });

        await customer.save();

        res.status(201).json({
            message: 'Customer added successfully',
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. Get All Customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();

        res.status(200).json(customers);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. Update Customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            message: 'Customer updated successfully',
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. Delete Customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(
            req.params.id
        );

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;

