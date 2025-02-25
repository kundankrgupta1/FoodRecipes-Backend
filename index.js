import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import foodRouter from "./routes/food.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => res.status(200).send("Server is live..."));

app.use(userRouter);
app.use(foodRouter);

connectDB()
	.then(() => {
		console.log(`🚀 [Startup Success]: Database connected successfully! Server is starting...`);
		app.listen(process.env.PORT || 3000, () => {
			console.log(`🌐 [Server Running]: Application is live on ${`http://${process.env.HOST}:${process.env.PORT}`}`);
		});
	})
	.catch((error) => {
		console.error(`❌ [Startup Error]: Unable to start the server due to database connection issues. Error: ${error.message}`);
	});
