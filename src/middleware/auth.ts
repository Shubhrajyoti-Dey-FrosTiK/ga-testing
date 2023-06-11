import { app, auth } from "../firebase/admin";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { checkRole } from "../routes/Role.controller";
import { NextFunction, Request, Response } from "express";

export interface DefaultProcessedAuthHeader {
  headers: {
    token: string;
    email: string;
  };
}

export type TokenEmail = {
  email?: string;
  error?: string;
};

export async function verifyToken(idToken: string): Promise<TokenEmail> {
  try {
    const status: DecodedIdToken = await auth.verifyIdToken(idToken);
    console.log(status);
    return { email: status.email ? status.email : "" };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headerToken = req.headers.token ? req.headers.token.toString() : "";
  const decodedToken: TokenEmail = await verifyToken(headerToken);

  if (decodedToken.error) {
    res.send("Token Error: " + decodedToken.error);
  } else {
    console.log("Gekki");
    req.headers.email = decodedToken.email;
    next();
  }
};
