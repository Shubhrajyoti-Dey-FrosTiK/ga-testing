import express, { Request } from "express";

/*-------- Model --------*/
import { GroupModel, Group } from "../models/Group.model";

/*------- Dependencies -------*/
import { DatabaseService } from "../services/database/database.service";

import { ResponseDto } from "../dto/response.dto";
import { DefaultProcessedAuthHeader, authMiddleware } from "../middleware/auth";
import RoleService from "../services/role/Role.service";
import { ROLE } from "../constants/Role.dictionary";

/*-------- Initialization--------*/
const router = express.Router();
const db = new DatabaseService();
const rs = new RoleService();

/*-------- Dto --------*/

interface GetGroup {
  headers: {
    groupid: string;
    email: string;
  };
}

interface CreateGroup extends DefaultProcessedAuthHeader {
  body: Group;
}

interface UpdateGroup extends GetGroup {
  body: {
    roles: Array<String>;
  };
}
/*-------- Methods --------*/

const getGroup = async (request: GetGroup): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.GROUP_READ))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    const group = await db.findOne(GroupModel, {
      _id: request.headers.groupid,
    });

    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const createGroup = async (request: CreateGroup): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.GROUP_CREATE))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    const group = await db.create(GroupModel, request.body);
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const updateGroup = async (request: UpdateGroup): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.GROUP_UPDATE))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    const group = await db.findOneAndUpdate(
      GroupModel,
      {
        _id: request.headers.groupid,
      },
      { $addToSet: { roles: { $each: request.body.roles } } },
      { new: true }
    );
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const deleteGroup = async (request: GetGroup): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.GROUP_DELETE))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    await GroupModel.findOneAndRemove({
      _id: request.headers.groupid,
    });
    return {
      message: "SUCCESS",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

/*-------- Routes --------*/

router.get(
  "/id",
  [authMiddleware],
  async (request: GetGroup, response: any) => {
    const group: ResponseDto = await getGroup(request);
    response.send(group);
  }
);

router.post(
  "/",
  [authMiddleware],
  async (request: CreateGroup, response: any) => {
    const group: ResponseDto = await createGroup(request);
    response.send(group);
  }
);

router.put(
  "/id",
  [authMiddleware],
  async (request: UpdateGroup, response: any) => {
    const group: ResponseDto = await updateGroup(request);
    response.send(group);
  }
);

router.delete(
  "/id",
  [authMiddleware],
  async (request: UpdateGroup, response: any) => {
    const group: ResponseDto = await deleteGroup(request);
    response.send(group);
  }
);
export default router;
