import express, { Request } from "express";

/*-------- Model --------*/
import { CompanyModel, Company } from "../models/Company.model";

/*------- Dependencies -------*/
import { DatabaseService } from "../services/database/database.service";

import { ResponseDto } from "../dto/response.dto";
import { Group } from "../models/Group.model";
import { DefaultProcessedAuthHeader } from "../middleware/auth";
import RoleService from "../services/role/Role.service";
import { ROLE } from "../constants/Role.dictionary";
import { Recruiter, RecruiterModel } from "../models/Recruiter.model";
import { GROUP } from "../constants/Groups.dictionary";
import { Types } from "mongoose";

/*-------- Initialization--------*/
const router = express.Router();
const db = new DatabaseService();
const rs = new RoleService();

/*-------- Dto --------*/

interface CreateCompany extends DefaultProcessedAuthHeader {
  body: {
    company: Company;
    recruiter: {
      firstName: String;
      gender: String;
      contact: String;
      email: String;
      alternativeEmail?: String;
      alternateContact?: String;
      middleName?: String;
      lastName?: String;
    };
  };
}

interface GetCompany {
  headers: {
    companyid: string;
    email: string;
  };
}

interface UpdateCompany extends GetCompany {
  body: Company;
}
/*-------- Methods --------*/

const getCompany = async (request: GetCompany): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.COMPANY_READ))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    const group = await db.findOne(CompanyModel, {
      _id: request.headers.companyid,
    });
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const createCompany = async (request: CreateCompany): Promise<ResponseDto> => {
  try {
    const group = await db.create(CompanyModel, request.body);
    return {
      data: group,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const createRecruiterAndCompany = async (
  request: CreateCompany
): Promise<ResponseDto> => {
  try {
    const company = await db.create(CompanyModel, request.body.company);
    const recruiterObj = {
      ...request.body.recruiter,
      isActive: true,
      company: company["_id"],
      groups: db.batchConvertToObjectId(GROUP.INITIAL_GROUP),
    };
    const recruiter = await RecruiterModel.create(recruiterObj);
    return {
      data: { company, recruiter },
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const updateCompany = async (request: UpdateCompany): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.COMPANY_UPDATE))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    const group = await db.findOneAndUpdate(
      CompanyModel,
      {
        _id: request.headers.companyid,
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

const deleteCompany = async (request: GetCompany): Promise<ResponseDto> => {
  if (!(await rs.verifyRole(request.headers.email, ROLE.COMPANY_DELETE))) {
    return { error: "User does not exist or doesn't have this role" };
  }
  try {
    await CompanyModel.findOneAndRemove({
      _id: request.headers.companyid,
    });
    return {
      message: "SUCCESS",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

/*-------- Routes --------*/

router.get("/id", async (request: GetCompany, response: any) => {
  const group: ResponseDto = await getCompany(request);
  response.send(group);
});

router.post("/", async (request: CreateCompany, response: any) => {
  const group: ResponseDto = await createCompany(request);
  response.send(group);
});

router.post("/", async (request: CreateCompany, response: any) => {
  const group: ResponseDto = await createCompany(request);
  response.send(group);
});

router.post(
  "/recruiterAndCompany",
  async (request: CreateCompany, response: any) => {
    console.log(request.body);
    const group: ResponseDto = await createRecruiterAndCompany(request);
    response.send(group);
  }
);

router.put("/id", async (request: UpdateCompany, response: any) => {
  const group: ResponseDto = await updateCompany(request);
  response.send(group);
});

router.delete("/id", async (request: GetCompany, response: any) => {
  const group: ResponseDto = await deleteCompany(request);
  response.send(group);
});

export default router;
