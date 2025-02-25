import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import foodController from "../controllers/food.controller.js";
const foodRouter = express.Router();

foodRouter.get("/foods", foodController.getFood);
foodRouter.post("/fav", authMiddleware, foodController.addFav);
foodRouter.delete("/fav/:id", authMiddleware, foodController.removeFromFav);
foodRouter.get("/fav", authMiddleware, foodController.getFav);

export default foodRouter;