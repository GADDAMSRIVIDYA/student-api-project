"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
const helpers_1 = require("./helpers");
const inputValidation_1 = __importDefault(require("./inputValidation"));
const businessValidation_1 = require("./businessValidation");
const helpers_2 = require("./helpers");
var SortBy;
(function (SortBy) {
    SortBy["Name"] = "name";
    SortBy["RollNo"] = "rollno";
    SortBy["Rank"] = "rank";
})(SortBy || (SortBy = {}));
const user = {
    id: 1,
    mail: "gaddamsrividya@gmail.com",
    username: "vidya",
    password: "vidya@123",
};
router.post("/login", (req, res) => {
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ message: "Invalid request body" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (email !== user.mail || password !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, mail: user.mail, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
        userName: user.username,
        userMail: user.mail,
        token,
    });
});
router.post("/add-student", authMiddleware_1.default, inputValidation_1.default, businessValidation_1.addStudentValidation, async (req, res) => {
    try {
        const { name, rollNo, marks } = req.body;
        const students = req.students || (await (0, helpers_1.readStudentsFromFile)());
        students.push({ name, rollNo, marks });
        await (0, helpers_1.writeStudentsToFile)(students);
        res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: students,
        });
    }
    catch (err) {
        console.error("Error adding student", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.put("/update-student", authMiddleware_1.default, inputValidation_1.default, businessValidation_1.updateStudentValidation, async (req, res) => {
    try {
        const { name, rollNo, marks } = req.body;
        const students = req.students;
        const index = req.studentIndex;
        students[index].marks = marks;
        await (0, helpers_1.writeStudentsToFile)(students);
        res.json({
            success: true,
            message: `${name} details updated successfully`,
            data: students[index],
        });
    }
    catch (err) {
        console.error("Error updating student", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.get("/get-student/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const students = await (0, helpers_1.readStudentsFromFile)();
        const student = students.find((s) => s.name.toLowerCase() === name.toLowerCase());
        if (!student) {
            return res
                .status(404)
                .json({ success: false, message: "Student not found" });
        }
        res.json({
            success: true,
            message: `${name} details fetched successfully`,
            data: student,
        });
    }
    catch (err) {
        console.error("Error fetching student", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.get("/convert-to-mid-format", async (req, res) => {
    try {
        const students = (await (0, helpers_1.readStudentsFromFile)());
        // Check if already converted
        if (students.length && students[0].midMarks) {
            return res.json({
                success: true,
                message: "Students already in midMarks format",
                data: students,
            });
        }
        const updatedStudents = students.map((s) => ({
            name: s.name,
            rollNo: s.rollNo,
            midMarks: [
                {
                    type: "mid1",
                    maths: s.marks.maths,
                    physics: s.marks.physics,
                    chemistry: s.marks.chemistry,
                },
                {
                    type: "mid2",
                    maths: s.marks.maths - 5,
                    physics: s.marks.physics - 2,
                    chemistry: s.marks.chemistry - 3,
                },
                {
                    type: "mid3",
                    maths: s.marks.maths - 3,
                    physics: s.marks.physics - 4,
                    chemistry: s.marks.chemistry - 6,
                },
            ],
        }));
        await (0, helpers_1.writeStudentsToFile)(updatedStudents);
        res.json({
            success: true,
            message: "Converted student data to midMarks format successfully",
            data: updatedStudents,
        });
    }
    catch (err) {
        console.error("Error converting data format:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.get("/getRanks/:rollNo", async (req, res) => {
    try {
        const rollNo = req.params.rollNo;
        const students = await (0, helpers_1.readStudentsFromFile)();
        const student = students.find((s) => String(s.rollNo) === rollNo);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        const studentsWithTotals = students.map((s) => ({
            ...s,
            totalMarks: (0, helpers_2.calculateBestTwoTotal)(s.midMarks),
        }));
        const rankedStudents = studentsWithTotals
            .sort((a, b) => b.totalMarks - a.totalMarks)
            .map((s, index) => ({
            ...s,
            rank: index + 1,
        }));
        const studentWithRank = rankedStudents.find((s) => String(s.rollNo) === rollNo);
        if (!studentWithRank || !studentWithRank.name) {
            return res.status(404).json({
                success: false,
                message: "Student not found or ranking error",
            });
        }
        res.json({
            success: true,
            message: `${studentWithRank.name}'s rank fetched successfully`,
            data: studentWithRank,
        });
    }
    catch (err) {
        console.error("Error fetching student rank", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.get("/get-all-students", async (req, res) => {
    try {
        const sortKey = req.query.sortBy || SortBy.Rank;
        const students = await (0, helpers_1.readStudentsFromFile)();
        const studentsWithTotals = students.map((s) => ({
            totalMarks: (0, helpers_2.calculateBestTwoTotal)(s.midMarks),
            ...s,
        }));
        const rankedStudents = studentsWithTotals
            .sort((a, b) => b.totalMarks - a.totalMarks)
            .map((s, index) => ({
            rank: index + 1,
            ...s,
        }));
        const validSortOptions = [SortBy.Name, SortBy.RollNo, SortBy.Rank];
        if (!validSortOptions.includes(sortKey)) {
            return res.status(400).json({
                success: false,
                message: `Invalid sortBy value '${sortKey}'. Allowed values are: ${validSortOptions.join(", ")}`,
            });
        }
        const sortedStudents = [...rankedStudents].sort((a, b) => {
            const key = sortKey;
            const valA = a[key];
            const valB = b[key];
            if (typeof valA === "string" && typeof valB === "string") {
                return valA.localeCompare(valB);
            }
            else if (typeof valA === "number" && typeof valB === "number") {
                return valA - valB;
            }
            else {
                return String(valA).localeCompare(String(valB));
            }
        });
        res.json({
            success: true,
            data: sortedStudents,
        });
    }
    catch (err) {
        console.error("Error fetching all students:", err.message, err.stack);
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
});
exports.default = router;
