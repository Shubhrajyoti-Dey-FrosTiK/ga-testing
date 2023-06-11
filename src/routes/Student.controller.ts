import express, { Request } from "express";

/*-------- Model --------*/
import { StudentModel, Student } from "../models/Student.model";

/*------- Dependencies -------*/
import { DatabaseService } from "../services/database/database.service";

import { ResponseDto } from "../dto/response.dto";

/*-------- Initialization--------*/
const router = express.Router();
const db = new DatabaseService();

/*-------- Dto --------*/

interface CreateStudent {
  body: Student;
}

interface GetStudent {
  headers: {
    studentid: string;
  };
}

interface UpdateStudent extends CreateStudent, GetStudent {}
/*-------- Methods --------*/

const getGroup = async (request: GetStudent): Promise<ResponseDto> => {
  try {
    const group = await db.findOne(StudentModel, {
      _id: request.headers.studentid,
    });
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const createStudent = async (request: CreateStudent): Promise<ResponseDto> => {
  console.log(request.body);
  try {
    const group = await db.create(StudentModel, request.body);
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const updateStudent = async (request: UpdateStudent): Promise<ResponseDto> => {
  try {
    const group = await db.findOneAndUpdate(
      StudentModel,
      {
        _id: request.headers.studentid,
      },
      request.body,
      { new: true }
    );
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const deleteStudent = async (request: GetStudent): Promise<ResponseDto> => {
  try {
    await StudentModel.findOneAndRemove({
      _id: request.headers.studentid,
    });
    return {
      message: "SUCCESS",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

/*-------- Routes --------*/

router.get("/id", async (request: GetStudent, response: any) => {
  const group: ResponseDto = await getGroup(request);
  response.send(group);
});

router.post("/", async (request: CreateStudent, response: any) => {
  const group: ResponseDto = await createStudent(request);
  response.send(group);
});

router.put("/id", async (request: UpdateStudent, response: any) => {
  const group: ResponseDto = await updateStudent(request);
  response.send(group);
});

router.delete("/id", async (request: GetStudent, response: any) => {
  const group: ResponseDto = await deleteStudent(request);
  response.send(group);
});
export default router;
