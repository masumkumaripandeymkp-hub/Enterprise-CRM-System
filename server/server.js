const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const customerRoutes = require('./routes/customerRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dealRoutes = require('./routes/dealRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/auth', authRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('Enterprise CRM API is running successfully!');
});

// Server Port
const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    });