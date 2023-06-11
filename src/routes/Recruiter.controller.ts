import express, { Request } from "express";

/*-------- Model --------*/
import { RecruiterModel, Recruiter } from "../models/Recruiter.model";

/*------- Dependencies -------*/
import { DatabaseService } from "../services/database/database.service";

import { ResponseDto } from "../dto/response.dto";
import { Group } from "../models/Group.model";
import { Company } from "../models/Company.model";

/*-------- Initialization--------*/
const router = express.Router();
const db = new DatabaseService();

/*-------- Dto --------*/

export interface RecruiterBody {
  firstName: string;
  contact: string;
  gender: string;
  email: string;
  alternateContact: string;
  isActive: boolean;
  company: Company;
  groups: Array<Group>;
  middleName?: string;
  lastName?: string;
}

interface CreateRecruiter {
  body: Recruiter;
}

interface GetRecruiter {
  headers: {
    recruiterid?: string;
    email?: string;
  };
}

interface UpdateRecruiter extends CreateRecruiter, GetRecruiter {}
/*-------- Methods --------*/

const getRecruiter = async (request: GetRecruiter): Promise<ResponseDto> => {
  try {
    const group = await db.findOne(RecruiterModel, {
      $or: [
        {
          _id: request.headers.recruiterid,
        },
        {
          email: request.headers.email,
        },
      ],
    });
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const createRecruiter = async (
  request: CreateRecruiter
): Promise<ResponseDto> => {
  console.log(request.body);
  try {
    const group = await db.create(RecruiterModel, request.body);
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const updateRecruiter = async (
  request: UpdateRecruiter
): Promise<ResponseDto> => {
  try {
    const group = await db.findOneAndUpdate(
      RecruiterModel,
      {
        _id: request.headers.recruiterid,
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

const deleteRecruiter = async (request: GetRecruiter): Promise<ResponseDto> => {
  try {
    await RecruiterModel.findOneAndRemove({
      _id: request.headers.recruiterid,
    });
    return {
      message: "SUCCESS",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

/*-------- Routes --------*/

router.get("/id", async (request: GetRecruiter, response: any) => {
  const group: ResponseDto = await getRecruiter(request);
  response.send(group);
});

router.post("/", async (request: CreateRecruiter, response: any) => {
  const group: ResponseDto = await createRecruiter(request);
  response.send(group);
});

router.put("/id", async (request: UpdateRecruiter, response: any) => {
  const group: ResponseDto = await updateRecruiter(request);
  response.send(group);
});

router.delete("/id", async (request: GetRecruiter, response: any) => {
  const group: ResponseDto = await deleteRecruiter(request);
  response.send(group);
});
export default router;
