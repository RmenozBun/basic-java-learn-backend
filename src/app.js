import express from "express";
import cors from "cors";
import config from "./config.js";
import { connectDB } from "./connect.js";
import indexRouter from "./index.route.js";

const app = express();
const port = config.app.port;
const subPath = config.app.subPath;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(subPath, indexRouter);
app.get(subPath + "/check", (req, res) => res.send("Server is running"));

connectDB();
app.listen(port, () => console.log(`Server Running At ${port}`));
