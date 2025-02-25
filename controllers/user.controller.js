import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
import favModel from "../models/fav.model.js";
dotenv.config();

const userRegister = async (req, res) => {
	const { name, email, password } = req.body
	try {
		const user = await userModel.findOne({ email });

		if (user) {
			return res.status(400).json({
				message: "User already exists",
				success: false
			});
		}

		const hash = await bcrypt.hash(password, 10);
		if (!hash) {
			return res.status(400).json({
				message: "Something went wrong",
				success: false
			});
		}

		const newUser = new userModel({ name, email, password: hash })
		await newUser.save();

		return res.status(200).json({
			message: "User registered successfully",
			success: true
		});

	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		});
	}
}

const userLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "User not found",
				success: false
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				message: "Invalid credentials",
				success: false
			});
		}

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

		if (!token) {
			return res.status(400).json({
				message: "Something went wrong",
				success: false
			});
		}

		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000
		});

		return res.status(200).json({
			message: "Login successful",
			token,
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			}
		});

	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		});
	}
}

const userProfile = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id).select("-password");
		if (!user) {
			return res.status(400).json({
				message: "User not found",
				success: false
			});
		}

		let allFav;
		allFav = await favModel.findOne({ userId: req.user._id });
		console.log(allFav)
		if (allFav === null) {
			allFav = undefined;
		}

		return res.status(200).json({
			message: "User profile fetch success",
			success: true,
			user,
			allFav: allFav
		});

	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		});
	}
}



export default { userRegister, userLogin, userProfile };