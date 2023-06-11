import express, { Request } from "express";
import { verifyToken } from "../middleware/auth";
import { RecruiterModel } from "../models/Recruiter.model";

const router = express.Router();

export interface VerifyToken {
  headers: {
    token: string;
  };
}

router.get("/verify", async (request: VerifyToken, response: any) => {
  const status = await verifyToken(request.headers.token);

  if (status.email) {
    const recruiter = await RecruiterModel.findOne({ email: status.email });
    response.send({ data: recruiter });
  } else {
    response.send(status);
  }
});
export default router;
