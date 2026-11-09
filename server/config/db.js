const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Mongo URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');

    const mongoURI = process.env.MONGO_URI;

    console.log(
        'Mongo hostname:',
        mongoURI ? mongoURI.split('@')[1]?.split('/')[0] : 'MISSING'
    );

    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('MongoDB Connected Successfully');

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('Error Name:', error.name);
        process.exit(1);
    }
};

module.exports = connectDB;