"use strict";
// const { validateStudentData } = require('./helpers');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inputValidation;
const helpers_1 = require("./helpers");
function inputValidation(req, res, next) {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Request body is missing",
        });
    }
    const { name, rollNo, marks } = req.body;
    if (name === undefined || rollNo === undefined || marks === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: name, rollNo, or marks",
        });
    }
    const validation = (0, helpers_1.validateStudentData)(name, rollNo, marks);
    if (!validation.valid) {
        return res
            .status(400)
            .json({ success: false, message: validation.message });
    }
    next();
}
