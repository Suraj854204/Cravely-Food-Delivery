import jwt from "jsonwebtoken";
import User from "../model/User.js";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please login — no auth header" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Please login — token missing" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SEC);
        // All tokens are signed with { userId }, so look that up
        if (!decoded?.userId) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ message: "Please login — invalid token" });
    }
};
