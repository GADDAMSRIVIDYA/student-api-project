// const { validateStudentData } = require('./helpers');

// function inputValidation(req, res, next) {
//     const { name, rollNo, marks } = req.body;
//     const validation = validateStudentData(name, rollNo, marks);
//     if (!validation.valid) {
//         return res.status(400).json({ success: false, message: validation.message });
//     }
//     next();
// }

// module.exports = inputValidation;


import { Request, Response, NextFunction } from "express";
import { validateStudentData } from "./helpers";

export default function inputValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
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


  const validation = validateStudentData(name, rollNo, marks);

  if (!validation.valid) {
    return res
      .status(400)
      .json({ success: false, message: validation.message });
  }

  next();
}
