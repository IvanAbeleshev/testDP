import { NextFunction, Request, Response } from 'express'
import { user, userRole } from '../interfaces'
import jwt from 'jsonwebtoken'

export const verifyTokenByAdminRole = (req: Request , res: Response, next: NextFunction) =>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(403).json({message: 'A token is required for authentication'})
    }

    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY) as user
    } catch (err) {
        return res.status(401).json({message: 'Invalid token'})
    }

    if(req.user.role!==userRole.admin){
      return res.status(401).json({message: 'You have not permition'})  
    }
    
    return next()
}