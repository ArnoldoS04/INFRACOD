import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://panel.infracod.com", // Aquí debe ser HTTPS si frontend usa HTTPS
    credentials: true,
  })
);

app.use("/api", routes);

// Crear servidor
app.listen(process.env.PORT, () => {
  console.log(`Server corriendo en https://api.infracod.com:${process.env.PORT}`);
});
