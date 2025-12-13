import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import helmet from "helmet";
import morgan from "morgan";
import recipeRoute from './routes/recipeRoutes.js'
import aiRoute from './routes/aiRoutes.js'
import uploadRouter from "./routes/updateImageRoute.js";
const app = express();
app.use(helmet());
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "10mb" }));
connectDB();

app.use('/api/recipes', recipeRoute)
app.use('/api/ai', aiRoute)
app.use("/api/file",uploadRouter)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
