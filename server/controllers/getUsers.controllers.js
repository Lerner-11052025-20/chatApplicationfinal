import express from "express";
import User from "../models/user.models.js";
const getUsers = async (req, res) => {
	try {
		const myId = req.user.id;
		const currentUser = await User.findById(myId);

		const users = await User.find({
			_id: {
				$ne: myId,
				$nin: [...currentUser.blockedUsers, ...currentUser.blockedBy]
			}
		}).select("-password");

		return res.status(201).json({ message: "User Found", users })
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching users" });
	}
};
export { getUsers };
