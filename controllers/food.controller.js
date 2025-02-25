import favModel from "../models/fav.model.js";
import userModel from "../models/user.model.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();




const getFood = async (req, res) => {
	const { query, cuisine, number, type } = req.query;
	try {
		const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&offset=0`, { params: { query: query || '', cuisine: cuisine || 'Indian', number: number || 20, type: type || 'Side Dish', addRecipeInformation: true, } });

		return res.status(200).json(response.data.results);

	} catch (error) {
		return res.status(500).json({
			message: error.response.data,
			success: false
		})
	}
};


const addFav = async (req, res) => {
	const { foodId, title, image } = req.body;
	try {
		const user = await userModel.findById(req.user._id);
		if (!user) {
			return res.status(404).json({
				message: "user not found!!!",
				success: false
			})
		}
		let favModelExisting = await favModel.findOne({ userId: req.user._id })
		if (!favModelExisting) {
			favModelExisting = new favModel({
				userId: req.user._id,
				items: []
			})
		}

		let foodIdExitsting = favModelExisting.items.findIndex((item) => item.foodId === foodId);

		if (foodIdExitsting !== -1) {
			return res.status(500).json({
				message: "foodId already in existing!!!",
				success: false
			})
		}

		favModelExisting.items.push({ foodId: foodId, title, image })

		await favModelExisting.save();

		return res.status(200).json({
			message: "added to Fav",
			success: true
		})
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		})
	}
}

const removeFromFav = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id)

		if (!user) {
			return res.status(404).json({
				message: "User not found!!!",
				success: false
			})
		}

		const favModelExisting = await favModel.findOne({ userId: req.user._id })

		console.log("favModelExisting", favModelExisting);

		const findFavItem = await favModelExisting.items.findIndex((item) => item.foodId === Number(req.params.id))


		if (findFavItem === -1) {
			return res.status(404).json({
				message: "FoodId not in Fav",
				success: false
			})
		}

		favModelExisting.items.splice(findFavItem, 1)

		await favModelExisting.save();

		return res.status(200).json({
			message: "Remove success",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		})
	}
}

const getFav = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id)
		if (!user) {
			return res.status(404).json({
				message: "User not found",
				success: false
			})
		}

		const favModelExisting = await favModel.findOne({ userId: req.user._id })

		const getAllFav = await favModelExisting.items

		console.log(getAllFav);

		return res.status(200).json({
			message: "Success",
			success: true,
			data: getAllFav
		})
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false
		})
	}
}

export default { getFood, addFav, removeFromFav, getFav };


