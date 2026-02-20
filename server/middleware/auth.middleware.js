import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.models.js'
dotenv.config();

export const Authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next();

    } catch (error) {
        res.status(401).json({ message: "Token is not valid!" })
    }
}

export const AdminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('role isBanned');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        req.adminUser = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error in admin check' });
    }
}