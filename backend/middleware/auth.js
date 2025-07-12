import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}