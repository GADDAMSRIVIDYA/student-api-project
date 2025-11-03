"use strict";
// import { promises as fs, constants } from 'fs';
// import dotenv from 'dotenv';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_NAME = void 0;
exports.readStudentsFromFile = readStudentsFromFile;
exports.writeStudentsToFile = writeStudentsToFile;
exports.validateStudentData = validateStudentData;
exports.calculateBestTwoTotal = calculateBestTwoTotal;
// dotenv.config();
// const FILE_NAME = process.env.FILE_NAME || 'students.txt';
// // 👇 Define and export the Student interface (to fix your earlier error)
// export interface Student {
//   name: string;
//   rollNo: string | number;
//   marks: Record<string, number>; // example: { math: 90, english: 85 }
// }
// export async function readStudentsFromFile(): Promise<Student[]> {
//   console.log("File reading started....");
//   try {
//     await fs.access(FILE_NAME, constants.F_OK);
//     console.log("File path exists");
//     const data = await fs.readFile(FILE_NAME, 'utf8');
//     if (!data.trim()) return []; // handle empty file
//     return JSON.parse(data) as Student[];
//   } catch (err: any) {
//     if (err.code === 'ENOENT') {
//       console.log("File does not exist");
//       return [];
//     } else {
//       console.error("File reading error:", err);
//       return [];
//     }
//   }
// }
// export async function writeStudentsToFile(students: Student[]): Promise<void> {
//   console.log("File writing started....");
//   try {
//     await fs.writeFile(FILE_NAME, JSON.stringify(students, null, 2));
//     console.log("File writing completed....");
//   } catch (err) {
//     console.error("File writing error:", err);
//   }
// }
// export function validateStudentData(
//   name: unknown,
//   rollNo: unknown,
//   marks: unknown
// ): { valid: boolean; message?: string } {
//   if (!name || typeof name !== 'string')
//     return { valid: false, message: 'Name is required' };
//   if (!rollNo || (typeof rollNo !== 'string' && typeof rollNo !== 'number'))
//     return { valid: false, message: 'Roll number is required' };
//   if (!marks || typeof marks !== 'object' || Array.isArray(marks))
//     return {
//       valid: false,
//       message: 'Marks should be an object with subjects as keys and numbers as values',
//     };
//   for (const key in marks as Record<string, unknown>) {
//     if (typeof (marks as Record<string, unknown>)[key] !== 'number')
//       return { valid: false, message: 'All marks should be numbers' };
//   }
//   return { valid: true };
// }
// export interface Marks {
//   [subject: string]: number;
// }
// export interface Student {
//   name: string;
//   rollNo: string | number;
//   marks: Marks;
// }
// export interface Student {
//   name: string;
//   rollNo: number | string;
//   maths: number;
//   physics: number;
//   chemistry: number;
// }
const fs_1 = require("fs");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.FILE_NAME = process.env.FILE_NAME || "students.txt";
async function readStudentsFromFile() {
    console.log("File reading started....");
    try {
        await fs_1.promises.access(exports.FILE_NAME, fs_1.constants.F_OK);
        console.log("File path exists");
        const data = await fs_1.promises.readFile(exports.FILE_NAME, "utf8");
        if (!data.trim())
            return [];
        return JSON.parse(data);
    }
    catch (err) {
        if (err.code === "ENOENT") {
            console.log("File does not exist");
            return [];
        }
        else {
            console.error("File reading error:", err);
            return [];
        }
    }
}
async function writeStudentsToFile(students) {
    console.log("File writing started....");
    try {
        await fs_1.promises.writeFile(exports.FILE_NAME, JSON.stringify(students, null, 2));
        console.log("File writing completed....");
    }
    catch (err) {
        console.error("File writing error:", err);
    }
}
function validateStudentData(name, rollNo, marks) {
    if (!name || typeof name !== "string")
        return { valid: false, message: "Name is required" };
    if (!rollNo || (typeof rollNo !== "string" && typeof rollNo !== "number"))
        return { valid: false, message: "Roll number is required" };
    if (!marks || typeof marks !== "object" || Array.isArray(marks))
        return {
            valid: false,
            message: "Marks should be an object with subjects as keys and numbers as values",
        };
    for (const key in marks) {
        if (typeof marks[key] !== "number")
            return { valid: false, message: "All marks should be numbers" };
    }
    return { valid: true };
}
function calculateBestTwoTotal(midMarks) {
    function bestTwoSum(arr) {
        let max1 = 0, max2 = 0;
        for (const val of arr) {
            if (val > max1) {
                max2 = max1;
                max1 = val;
            }
            else if (val > max2) {
                max2 = val;
            }
        }
        return max1 + max2;
    }
    const mathsMarks = midMarks.map(m => Number(m.maths));
    const physicsMarks = midMarks.map(m => Number(m.physics));
    const chemistryMarks = midMarks.map(m => Number(m.chemistry));
    const bestTwoMaths = bestTwoSum(mathsMarks);
    const bestTwoPhysics = bestTwoSum(physicsMarks);
    const bestTwoChemistry = bestTwoSum(chemistryMarks);
    return bestTwoMaths + bestTwoPhysics + bestTwoChemistry;
}
