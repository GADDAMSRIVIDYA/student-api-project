import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import authMiddleware from "./authMiddleware";
import {readStudentsFromFile,writeStudentsToFile,Student,} from "./helpers";
import inputValidation from "./inputValidation";
import {addStudentValidation,updateStudentValidation,} from "./businessValidation";
import {LoginBodyDto,AddStudentBodyDto,GetStudentParamsDto,UpdateStudentBodyDto,GetStudentRollNoDto} from "./student.dto";
import { StudentWithMidMarks } from "./student.dto";
import { calculateBestTwoTotal } from "./helpers";

interface OldStudent {
  name: string;
  rollNo:string;
  marks: {
    maths: number;
    physics: number;
    chemistry: number;
  };
}


enum SortBy {
  Name = "name",
  RollNo = "rollno",
  Rank = "rank"
}


const user = {
  id: 1,
  mail: "gaddamsrividya@gmail.com",
  username: "vidya",
  password: "vidya@123",
};

router.post("/login", (req: Request<{}, {}, LoginBodyDto>, res: Response) => {
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

  const token = jwt.sign(
    { id: user.id, mail: user.mail, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.json({
    userName: user.username,
    userMail: user.mail,
    token,
  });
});

router.post(
  "/add-student",
  authMiddleware,
  inputValidation,
  addStudentValidation,
  async (req: Request<{}, {}, AddStudentBodyDto>, res: Response) => {
    try {
      const { name, rollNo, marks } = req.body;
      const students =
        (req as any).students || (await readStudentsFromFile());
      students.push({ name, rollNo, marks });
      await writeStudentsToFile(students);

      res.status(201).json({
        success: true,
        message: "Student added successfully",
        data: students,
      });
    } catch (err) {
      console.error("Error adding student", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);


router.put(
  "/update-student",
  authMiddleware,
  inputValidation,
  updateStudentValidation,
  async (req: Request<{}, {}, UpdateStudentBodyDto>, res: Response) => {
    try {
      const { name, rollNo, marks } = req.body;
      const students = (req as any).students;
      const index = (req as any).studentIndex;

      students[index].marks = marks;
      await writeStudentsToFile(students);

      res.json({
        success: true,
        message: `${name} details updated successfully`,
        data: students[index],
      });
    } catch (err) {
      console.error("Error updating student", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);


router.get(
  "/get-student/:name",
  async (req: Request<GetStudentParamsDto>, res: Response) => {
    try {
      const { name } = req.params;
      const students = await readStudentsFromFile();
      const student = students.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );

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
    } catch (err) {
      console.error("Error fetching student", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);


router.get("/convert-to-mid-format", async (req: Request, res: Response) => {
  try {
    const students = (await readStudentsFromFile()) as any[];

    // Check if already converted
    if (students.length && students[0].midMarks) {
      return res.json({
        success: true,
        message: "Students already in midMarks format",
        data: students,
      });
    }

    const updatedStudents = students.map((s: any) => ({
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

    await writeStudentsToFile(updatedStudents);

    res.json({
      success: true,
      message: "Converted student data to midMarks format successfully",
      data: updatedStudents,
    });
  } catch (err: any) {
    console.error("Error converting data format:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.get("/getRanks/:rollNo", async (req: Request<GetStudentRollNoDto>, res: Response) => {
  try {
    const rollNo = req.params.rollNo;
    const students = await readStudentsFromFile();
    const student = students.find((s) => String(s.rollNo) === rollNo);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const studentsWithTotals = students.map((s) => ({
      ...s,
      totalMarks: calculateBestTwoTotal(s.midMarks),
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

  } catch (err) {
    console.error("Error fetching student rank", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.get("/get-all-students", async (req: Request, res: Response) => {
  try {
    const sortKey = (req.query.sortBy as string) || SortBy.Rank;
    const students = await readStudentsFromFile();

    const studentsWithTotals = students.map((s) => ({
      totalMarks: calculateBestTwoTotal(s.midMarks),
      ...s,
    }));

    const rankedStudents = studentsWithTotals
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .map((s, index) => ({
        rank: index + 1,
        ...s,
      }));

    const validSortOptions = [SortBy.Name, SortBy.RollNo, SortBy.Rank];

    if (!validSortOptions.includes(sortKey as SortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sortBy value '${sortKey}'. Allowed values are: ${validSortOptions.join(", ")}`,
      });
    }

    const sortedStudents = [...rankedStudents].sort((a, b) => {
       const key = sortKey as keyof typeof a;
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB);
      } else if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      } else {
        return String(valA).localeCompare(String(valB));
      }
    });

    res.json({
      success: true,
      data: sortedStudents,
    });
  } catch (err: any) {
    console.error("Error fetching all students:", err.message, err.stack);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

export default router;
