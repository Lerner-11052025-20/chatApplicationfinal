import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        // e.g. 'BAN_USER', 'UNBAN_USER', 'DELETE_USER', 'DELETE_MESSAGE'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    targetMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    meta: {
        type: mongoose.Schema.Types.Mixed,   // extra context (reason, etc.)
        default: {},
    },
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
