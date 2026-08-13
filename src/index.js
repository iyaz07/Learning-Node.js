import { connectDB } from "./db/index.js"
import express from "express";
import userRoutes from "./routes/userRoutes.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/api", userRoutes)


const start = async () => {
    const uri = process.env.mongodb_uri
    if (!uri || uri.includes("<db_password>")) {
        console.error("MONGODB_URI is missing or still contains <db_password> placeholder. Update .env and retry.")
        process.exit(1)
    }
    try {
        await connectDB(uri)
        console.log("MongoDB connected")
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        process.exit(1)
    }
}

start()

if (process.env.NODE_ENV !== "production") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

export default app;