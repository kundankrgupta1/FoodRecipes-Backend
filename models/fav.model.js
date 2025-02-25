import mongoose from "mongoose";

const favSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	items: [{
		foodId: {
			type: Number,
			required: true
		},
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true
		}
	}]
})

const favModel = mongoose.model("Fav", favSchema);

export default favModel;
