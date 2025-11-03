// import { promises as fs, constants } from 'fs';
// import dotenv from 'dotenv';

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

import { promises as fs, constants } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

export const FILE_NAME = process.env.FILE_NAME || "students.txt";
export interface Student {
  name: string;
  rollNo:string;
  midMarks: {
    type: string;
    maths: number;
    physics: number;
    chemistry: number;
  }[];
}

export async function readStudentsFromFile(): Promise<Student[]> {
  console.log("File reading started....");
  try {
    await fs.access(FILE_NAME, constants.F_OK);
    console.log("File path exists");

    const data = await fs.readFile(FILE_NAME, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data) as Student[];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.log("File does not exist");
      return [];
    } else {
      console.error("File reading error:", err);
      return [];
    }
  }
}

export async function writeStudentsToFile(students: Student[]): Promise<void> {
  console.log("File writing started....");
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify(students, null, 2));
    console.log("File writing completed....");
  } catch (err) {
    console.error("File writing error:", err);
  }
}

export function validateStudentData(
  name: any,
  rollNo: any,
  marks: any
): { valid: boolean; message?: string } {
  if (!name || typeof name !== "string")
    return { valid: false, message: "Name is required" };

  if (!rollNo || (typeof rollNo !== "string" && typeof rollNo !== "number"))
    return { valid: false, message: "Roll number is required" };

  if (!marks || typeof marks !== "object" || Array.isArray(marks))
    return {
      valid: false,
      message:
        "Marks should be an object with subjects as keys and numbers as values",
    };

  for (const key in marks) {
    if (typeof marks[key] !== "number")
      return { valid: false, message: "All marks should be numbers" };
  }

  return { valid: true };
}


export function calculateBestTwoTotal(
  midMarks: Array<{ type: string; maths: number; physics: number; chemistry: number }>
): number {
  function bestTwoSumUsingMin(arr: number[]): number {
    if (arr.length === 0) return 0;
    if (arr.length <= 2) return arr.reduce((a, b) => a + b, 0);
    const total = arr.reduce((a, b) => a + b, 0);
    const min = Math.min(...arr);
    return total - min;
  }

  const mathsMarks = midMarks.map(m => Number(m.maths));
  const physicsMarks = midMarks.map(m => Number(m.physics));
  const chemistryMarks = midMarks.map(m => Number(m.chemistry));

  const bestTwoMaths = bestTwoSumUsingMin(mathsMarks);
  const bestTwoPhysics = bestTwoSumUsingMin(physicsMarks);
  const bestTwoChemistry = bestTwoSumUsingMin(chemistryMarks);

  return bestTwoMaths + bestTwoPhysics + bestTwoChemistry;
}








