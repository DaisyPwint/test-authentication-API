import express from "express";
import {
    getAllUsers,
    loginAccount,
    registerAccount,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerAccount);
router.post("/login", loginAccount);

export const authRouter = router;
