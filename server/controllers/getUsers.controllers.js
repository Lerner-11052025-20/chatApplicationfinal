import express from "express";
import User from "../models/user.models.js";
const getUsers = async (req, res) => {
	try {
		const myId = req.user.id;;
		const users = await User.find({ _id: { $ne: myId } }).select(
			"-password"
		);
        return res.status(201).json({message: "User Found", users})
	} catch (error) {
		console.log(error);
	}
};
export { getUsers };
