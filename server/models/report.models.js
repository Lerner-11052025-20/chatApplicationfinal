import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['Spam', 'Harassment', 'Inappropriate Content', 'Fake Account', 'Other']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'action_taken'],
        default: 'pending'
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
