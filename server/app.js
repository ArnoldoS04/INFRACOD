import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";

dotenv.config();

const key = fs.readFileSync("./certs/infracod.local-key.pem");
const cert = fs.readFileSync("./certs/infracod.local.pem");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://infracod.local", // Aquí debe ser HTTPS si frontend usa HTTPS
    credentials: true,
  })
);

app.use("/api", routes);

// Crear servidor HTTPS
https.createServer({ key, cert }, app).listen(process.env.PORT, () => {
  console.log(`Server corriendo en https://infracod.local:${process.env.PORT}`);
});
