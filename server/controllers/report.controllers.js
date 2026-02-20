import Report from '../models/report.models.js';

export const reportUser = async (req, res) => {
    try {
        const { reportedUserId, reason, description } = req.body;
        const reporterId = req.user.id;

        if (reporterId === reportedUserId) {
            return res.status(400).json({ message: "You cannot report yourself" });
        }

        const report = new Report({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reason,
            description
        });

        await report.save();

        res.status(201).json({ message: "Report submitted successfully. Thank you for making the platform safer." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error submitting report" });
    }
};
