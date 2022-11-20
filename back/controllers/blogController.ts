import { Request, Response } from 'express'
import { WhereOptions } from 'sequelize'
import { blogs, category, users } from '../model'
import fileUpload, { UploadedFile } from 'express-fileupload'
import {v4} from 'uuid'
import path from 'path'
import { userRole } from '../interfaces'
import fs from 'fs'

interface iGetAll extends Request{
    query:{
        page?: string,
        limit?: string,
        userId?: string,
        categoryId?: string
    }
}

interface iAddBlog extends Request{
    body:{
        title: string,
        categoryId: number,
        text: string
    }
}

interface iGetOne extends Request{
    params:{
        id: string
    }
}

interface iRemove extends Request{
    params:{
        id: string
    }
}

interface iChangeItem extends iAddBlog{
    params:{
        id: string
    }
}

const moveFile=(files: fileUpload.FileArray):string|undefined=>{
    const arrayFilesName: string[] = []
    for(let item in files){
        
        const currentFile: UploadedFile = <UploadedFile>files[item];
        let fileName = v4()+'.jpeg'
        currentFile.mv(path.resolve(__dirname, '..', 'static', fileName))
        arrayFilesName.push(fileName)
    
    }

    if(arrayFilesName.length>0){
        return arrayFilesName[0]
    }

}

class blogController{
    public addBlog=async(req: iAddBlog, res: Response)=>{
        if(!req.user){
            return res.status(401).json({message: 'user is indetified'})
        }

        let cover
        if(req.files){
            cover = moveFile(req.files)
        }
        
        let resultItem
        if(cover)
        {
            resultItem = await blogs.create({...req.body, userId: req.user.id, cover})
        }else{
            resultItem = await blogs.create({...req.body, userId: req.user.id})
        }

        res.status(200).json(resultItem)
    }

    public getAll=async(req: iGetAll, res: Response)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const offset = (page-1)*limit

        const filter:WhereOptions = {}
        if(req.query.userId){
            filter.userId = req.query.userId  
        }

        if(req.query.categoryId){
            filter.categoryId = req.query.categoryId  
        }

        const result = await blogs.findAndCountAll({where:filter, limit, offset, include: [{model: users, attributes: ['id', 'login']}, {model: category, as:'category'}], order:[['id', 'ASC']] })

        return res.status(200).json(result)

    }

    public getOne=async(req: iGetOne, res: Response)=>{
        //this row can be get error
        const id = Number(req.params.id)
        const result = await blogs.findOne({where:{id}, include: [{model: users, attributes: ['id', 'login']}, {model: category, as:'category'}]})

        res.status(200).json(result)
    }

    public changeItem=async(req:iChangeItem, res: Response )=>{
        if(!req.user){
            res.status(401).json({message: 'user not finded'})
        }

        const id = Number(req.query.id)

        const candidat = await blogs.findOne({where:{id}})

        if(candidat?.getDataValue('userId')===req.user?.id || req.user?.role===userRole.admin){
            let cover
            if(req.files){
                //remove file and
                const imgName = candidat?.getDataValue('cover')
                if(imgName){
                    fs.unlinkSync(path.resolve(__dirname, '..', 'static', imgName))
                } 
                cover = moveFile(req.files)
            }
            try{
                if(cover){
                    await blogs.update({...req.body, cover}, {where:{id}})
                }else{
                    await blogs.update(req.body, {where:{id}})
                }
                return res.status(200)
            }catch(error){
                return res.status(401).json({message: 'undefined error'})
            }
        }

        
        return res.status(401).json({message: 'You have not permission to change blog'})
    }

    public removeItem=async(req: iRemove, res: Response)=>{
        if(!req.user){
            res.status(401).json({message: 'user not finded'})
        }

        const id = Number(req.params.id)
        
        const candidat = await blogs.findOne({where: {id}})
        if(candidat?.getDataValue('userid')===id || req.user?.role === userRole.admin){
            await blogs.destroy({where:{id}})   
            res.status(200)
        }

        res.status(401).json({message: 'You have not permission to delete blog'})
    }
}

export default new blogController