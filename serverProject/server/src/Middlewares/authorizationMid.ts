import { Request, Response, NextFunction } from "express";
import {logger} from "../Utils/Logger";


export function AuthorizatTeacher(req: Request, res: Response, next: NextFunction) {

  logger.debug("the user is: "+(req as any).user)
  
if ((req as any).role?.toLowerCase().trim() === "teacher") {
    next();
}
  else return res.status(403).json({error: "the user not allow to enter this page"})
}


