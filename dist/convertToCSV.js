"use strict";
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function calculateBestTwoTotal(midMarks) {
    const midTotals = midMarks.map((m) => m.maths + m.physics + m.chemistry);
    midTotals.sort((a, b) => b - a);
    return midTotals[0] + midTotals[1];
}
const inputPath = path.join(__dirname, "students.txt");
const outputPath = path.join(__dirname, "students.csv");
const data = fs.readFileSync(inputPath, "utf-8");
const students = JSON.parse(data);
const studentsWithTotals = students.map((s) => ({
    ...s,
    totalMarks: calculateBestTwoTotal(s.midMarks),
}));
const rankedStudents = [...studentsWithTotals]
    .sort((a, b) => b.totalMarks - a.totalMarks)
    .map((s, index) => ({
    ...s,
    rank: index + 1,
}));
let csv = "name,rollNo,maths1,physics1,chemistry1,maths2,physics2,chemistry2,maths3,physics3,chemistry3,totalMarks,rank\n";
for (const s of rankedStudents) {
    const m1 = s.midMarks[0];
    const m2 = s.midMarks[1];
    const m3 = s.midMarks[2];
    csv += `${s.name},${s.rollNo},${m1.maths},${m1.physics},${m1.chemistry},${m2.maths},${m2.physics},${m2.chemistry},${m3.maths},${m3.physics},${m3.chemistry},${s.totalMarks},${s.rank}\n`;
}
fs.writeFileSync(outputPath, csv);
console.log("✅ students.csv created successfully with totals and ranks!");
