import { db } from "../index.js";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
    try {
        const getUsersQ = "SELECT * FROM users";
        db.query(getUsersQ, (err, data) => {
            if (err) throw new Error(err);

            if (!data?.length)
                return res.json({
                    success: true,
                    message: "There is no users for now!",
                });

            return res.json({
                success: true,
                data: data,
            });
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const registerAccount = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!(name && password && email))
            return res.json({
                success: false,
                message: "All fields are required!",
            });

        const findDuplicateQ = "SELECT * FROM users WHERE email = ?";

        db.query(findDuplicateQ, [email], (err, data) => {
            if (err) throw new Error(err);

            if (data?.length > 0)
                return res.json({
                    success: false,
                    message: `Email already existed!`,
                });
            const createAccQ =
                "INSERT INTO users (`name`, `password`, `email`) VALUES (?)";

            const userData = [name, password, email];

            const token = db.query(createAccQ, [userData], (err, data) => {
                if (err) throw new Error(err);

                return res.json({
                    success: true,
                    message: "Account created successfully!",
                    data: data[0],
                });
            });
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const loginAccount = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!(email && password) || !email || !password) {
        return res.json({
            success: false,
            message: "All fields are required!",
        });
    }

    if (password.trim().length < 8) {
        return res.json({ success: false, message: "Password is incorrect!" });
    }

    const q = " SELECT * FROM users WHERE email = ? ";
    db.query(q, [email], (err, data) => {
        if (data?.length < 1) {
            res.json({
                success: false,
                message: "Email or password is wrong!",
            });
        } else {
            const isCorrect = password === data[0]?.password;

            if (!isCorrect) {
                res.json({
                    success: false,
                    message: "Email or password is wrong!",
                });
            } else {
                const token = jwt.sign(
                    { email: email },
                    process.env.ACCESS_SECRET_TOKEN,
                    { expiresIn: 60 * 60 * 24 }
                );
                res.json({
                    success: true,
                    user: data[0],
                    token: token,
                    message: "Login successful!",
                });
            }
        }
    });
};
