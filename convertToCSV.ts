import * as fs from "fs";
import * as path from "path";


function calculateBestTwoTotal(midMarks: any[]): number {
  const midTotals = midMarks.map((m) => m.maths + m.physics + m.chemistry);
  midTotals.sort((a, b) => b - a);
  return midTotals[0] + midTotals[1];
}

const inputPath = path.join(__dirname, "students.txt");
const outputPath = path.join(__dirname, "students.csv");

const data = fs.readFileSync(inputPath, "utf-8");
const students = JSON.parse(data);

const studentsWithTotals = students.map((s: any) => ({
  ...s,
  totalMarks: calculateBestTwoTotal(s.midMarks),
}));

const rankedStudents = [...studentsWithTotals]
  .sort((a, b) => b.totalMarks - a.totalMarks)
  .map((s, index) => ({
    ...s,
    rank: index + 1,
  }));

let csv =
  "name,rollNo,maths1,physics1,chemistry1,maths2,physics2,chemistry2,maths3,physics3,chemistry3,totalMarks,rank\n";

for (const s of rankedStudents) {
  const m1 = s.midMarks[0];
  const m2 = s.midMarks[1];
  const m3 = s.midMarks[2];
  csv += `${s.name},${s.rollNo},${m1.maths},${m1.physics},${m1.chemistry},${m2.maths},${m2.physics},${m2.chemistry},${m3.maths},${m3.physics},${m3.chemistry},${s.totalMarks},${s.rank}\n`;
}

fs.writeFileSync(outputPath, csv);
console.log("✅ students.csv created successfully with totals and ranks!");
