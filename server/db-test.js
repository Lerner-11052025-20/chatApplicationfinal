import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
console.log('Attempting to connect to:', MONGO_URI);

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('SUCCESS: MongoDB Connected Successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('FAILURE: Connection error occurred:');
        console.error('Type:', err.name);
        console.error('Message:', err.message);
        console.log('\nPossible Solution: This error usually means your IP is not whitelisted in MongoDB Atlas. Go to Atlas -> Network Access and add your current IP address.');
        process.exit(1);
    });
