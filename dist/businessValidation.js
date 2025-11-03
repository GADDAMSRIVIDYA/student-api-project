"use strict";
// const { readStudentsFromFile } = require('./helpers');
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStudentValidation = addStudentValidation;
exports.updateStudentValidation = updateStudentValidation;
const helpers_1 = require("./helpers");
async function addStudentValidation(req, res, next) {
    try {
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
        if (typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'name' — expected string",
            });
        }
        if (typeof rollNo !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'rollNo' — expected number",
            });
        }
        if (typeof marks !== "object" || marks === null || Array.isArray(marks)) {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'marks' — expected object with subject scores",
            });
        }
        const validSubjects = ["maths", "physics", "chemistry"];
        for (const subject of validSubjects) {
            if (typeof marks[subject] !== "number") {
                return res.status(400).json({
                    success: false,
                    message: `Invalid type for '${subject}' — expected number`,
                });
            }
        }
        const students = await (0, helpers_1.readStudentsFromFile)();
        const existing = students.find((s) => s.rollNo === rollNo);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Roll number already exists",
            });
        }
        req.students = students;
        next();
    }
    catch (err) {
        console.error("Error in addStudentValidation:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
async function updateStudentValidation(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing",
            });
        }
        const { name, rollNo, marks } = req.body;
        if (name === undefined || rollNo === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name or rollNo",
            });
        }
        if (typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'name' — expected string",
            });
        }
        if (typeof rollNo !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'rollNo' — expected number",
            });
        }
        if (marks !== undefined &&
            (typeof marks !== "object" || marks === null || Array.isArray(marks))) {
            return res.status(400).json({
                success: false,
                message: "Invalid type for 'marks' — expected object with subject scores",
            });
        }
        if (marks) {
            const validSubjects = ["maths", "physics", "chemistry"];
            for (const subject of validSubjects) {
                if (typeof marks[subject] !== "number") {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid type for '${subject}' — expected number`,
                    });
                }
            }
        }
        const students = await (0, helpers_1.readStudentsFromFile)();
        const studentIndex = students.findIndex((s) => s.name === name && s.rollNo === rollNo);
        if (studentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        req.students = students;
        req.studentIndex = studentIndex;
        next();
    }
    catch (err) {
        console.error("Error in updateStudentValidation:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
