import express, { Request } from "express";

/*-------- Model --------*/
import { RecruiterModel, Recruiter } from "../models/Recruiter.model";
import { StudentModel, Student } from "../models/Student.model";

/*------- Dependencies -------*/
import { DatabaseService } from "../services/database/database.service";

import { ResponseDto } from "../dto/response.dto";
import { Group } from "../models/Group.model";
import { Company } from "../models/Company.model";

/*-------- Initialization--------*/
const router = express.Router();
const db = new DatabaseService();

/*-------- Dto --------*/

export interface GetRoles {
  headers: {
    userid?: string;
    email?: string;
  };
}
/*-------- Methods --------*/

export const checkRole = async (request: GetRoles): Promise<ResponseDto> => {
  try {
    const user = await RecruiterModel.findOne({
      $or: [
        {
          _id: request.headers.userid,
        },
        { email: request.headers.email },
      ],
    }).populate<{ groups: Array<Group> }>("groups");

    if (user) {
      const rolesList: Array<String> = [];
      user.groups.forEach((group: Group) => {
        group.roles.forEach((role) => {
          rolesList.push(role);
        });
      });

      return { data: rolesList };
    } else {
      return {
        error: "User not found",
      };
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

/*-------- Routes --------*/

router.get("/id", async (request: GetRoles, response: any) => {
  const group: ResponseDto = await checkRole(request);
  response.send(group);
});

export default router;
