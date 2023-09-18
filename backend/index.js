import express from "express";
import { config } from "dotenv";
import sql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import { authRouter } from "./routes/authRoutes.js";
import { corsOptions } from "./config/corsOptions.js";

config();
const app = express();

const PORT = 4000;
export const db = sql.createConnection({
    host: "localhost",
    database: "api_test_db",
    user: "root",
    password: process.env.USER_PASSWORD,
});

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

//routes
app.use("/users", authRouter);

app.listen(PORT, () => {
    if (db) {
        console.log("Connected to Database!");
    } else {
        console.error("Error connecting to the database");
    }
});
