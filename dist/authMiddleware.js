"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }
    if (typeof token !== "string" || token.split(".").length !== 3) {
        return res.status(400).json({ message: "Invalid token format" });
    }
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded; // store decoded user info for later use
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
