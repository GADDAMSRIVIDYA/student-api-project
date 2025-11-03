// export class LoginBodyDto {
//   email!: string;
//   password!: string;
// }

// export class AddStudentBodyDto {
//   name!: string;
//   rollNo!: number;
//   marks!: {
//     maths: number;
//     physics: number;
//     chemistry: number;
//   };
// }

// export class GetStudentParamsDto {
//   name!: string;
// }

// export class UpdateStudentBodyDto {
//   name!: string;
//   rollNo!: number;
//   marks!: {
//     maths: number;
//     physics: number;
//     chemistry: number;
//   };
// }

export interface LoginBodyDto {
  email: string;
  password: string;
}

export interface AddStudentBodyDto {
  name: string;
  rollNo: string;
  marks: {
    maths: number;
    physics: number;
    chemistry: number;
  };
}

export interface GetStudentParamsDto {
  name: string;
}
export interface GetStudentRollNoDto{
  rollNo:string;
}

export interface UpdateStudentBodyDto {
  name: string;
  rollNo: string;
  marks: {
    maths: number;
    physics: number;
    chemistry: number;
  };
}

// student.dto.ts
export interface MidMarks {
  type: string;
  maths: number;
  physics: number;
  chemistry: number;
}

export interface StudentWithMidMarks {
  name: string;
  rollNo: string;
  midMarks: MidMarks[];
}

