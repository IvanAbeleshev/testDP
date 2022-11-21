import { NextFunction, Request, Response } from 'express'
import { userRole } from '../interfaces'

export const verifyAdminRole = (req: Request , res: Response, next: NextFunction) =>{
    if(req.user?.role!==userRole.admin){
        return res.status(401).json({message: 'You have not permition'})  
      }
    
    return next()
}