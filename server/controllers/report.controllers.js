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
export const getMyReports = async (req, res) => {
    try {
        console.log("Fetching reports for reporter ID:", req.user.id);
        const reporterId = req.user.id;
        const reports = await Report.find({ reporter: reporterId })
            .populate('reportedUser', 'username email profilePic')
            .sort({ createdAt: -1 });

        console.log(`Found ${reports?.length || 0} reports`);
        res.status(200).json({ reports: reports || [] });
    } catch (err) {
        console.error("DEBUG ERROR in getMyReports:", err);
        res.status(500).json({ message: "Server error fetching your reports" });
    }
};
