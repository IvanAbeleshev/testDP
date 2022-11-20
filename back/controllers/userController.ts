import { Request, Response } from 'express'
import { createUser } from '../common/generally'
import { userRole } from '../interfaces'
import { blogs, users } from '../model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken=(id:number, login:string, role:userRole)=>{
    return jwt.sign({id, login, role}, process.env.SECRET_KEY, {expiresIn: 2592000})
}

interface iRequestCreqateUser extends Request{
    body:{
        login: string,
        password: string,
        role?: userRole
    }
}

interface iSignIn extends Request{
    body:{
        login: string,
        password: string,    
    }
}

interface iRemoveItem extends Request{
    params:{
        id: string
    }
}

class UserController{

    public getAll=async(req: Request, res: Response)=>{
        const result = await users.findAll()
        res.status(200).json(result)
    }

    public getOne=async(req: Request, res: Response)=>{

    }

    public createUser=async(req: iRequestCreqateUser, res: Response)=>{
        const createdUser = await createUser(req.body.login, req.body.password, req.body?.role)
        const token = createToken(createdUser.getDataValue('id') ,createdUser.getDataValue('login'), <userRole>createdUser.getDataValue('role'))
        return res.status(200).json({
            id: createdUser.getDataValue('id'),
            role: createdUser.getDataValue('role'),
            login: createdUser.getDataValue('login'),
            token
        })
    }

    public signIn=async(req:iSignIn, res: Response)=>{
        const candidat = await users.findOne({where:{login: req.body.login}})
        if(!candidat){
            return res.status(401).json({message: 'user is not fined'})
        }

        if(bcrypt.compareSync(req.body.password, candidat.getDataValue('password'))){
            const token = createToken(candidat.getDataValue('id') ,candidat.getDataValue('login'), <userRole>candidat.getDataValue('role'))
            return res.status(200).json({
                id: candidat.getDataValue('id'),
                role: candidat.getDataValue('role'),
                login: candidat.getDataValue('login'),
                token
            })
        }

        return res.status(401).json({message: 'incorrect password'})
    }

    public checkUser=async(req: Request, res: Response)=>{
        if(!req.user){
            return res.status(401).json({message: 'user is indetified'})
        }
        const token = createToken(req.user.id, req.user.login, req.user.role)

        return res.status(200).json({...req.user, token})         
    }

    public removeItem=async(req: iRemoveItem, res: Response)=>{
        const id = Number(req.params.id)
        if(req.user?.id === id){
            return res.status(401).json({message: 'You cant remove yourself user!'})
        }

        await blogs.destroy({where:{userId: id}})
        await users.destroy({where:{id}})

        return res.status(200)
    }
}

export default new UserController