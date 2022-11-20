import { Request, Response } from 'express'
import { blogs, category } from '../model'

interface iCreate extends Request{
    body:{
        name: string,
        description?: string
    }
}
interface iGetAll extends Request{
    query:{
        page?: string,
        limit?: string
    }
}

interface iParamsItem  extends Request{
    params:{
        id: string
    }
}

interface iChange extends iParamsItem{
    body:{
        name: string,
        description?: string
    }
}

class CategoryController{
    public create=async(req: iCreate, res: Response)=>{
        const result = await category.create({name: req.body.name, description: req.body.description})    
        
        return res.status(200).json(result)
    }

    public getAll=async(req: iGetAll, res: Response)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const offset = (page-1)*limit

        const result = await category.findAndCountAll({offset, limit, order:[['name', 'ASC']]})

        return res.status(200).json(result)

    }
    public getAllWithoutPagination=async(req: iGetAll, res: Response)=>{

        const result = await category.findAll({order:[['name', 'ASC']]})

        return res.status(200).json(result)

    }
    
    public removeItem=async(req: iParamsItem, res: Response)=>{
        const id = Number(req.params.id)

        await blogs.destroy({where:{categoryId: id}})
        await category.destroy({where:{id}})

        res.status(200)
    }

    public getOne=async(req:iParamsItem, res: Response)=>{
        const id = Number(req.params.id)
        const result = await category.findOne({where:{id}})

        res.status(200).json(result?.get())
    }

    public changeOne=async(req:iChange, res: Response)=>{
        const id = Number(req.params.id)    
        const result = await category.update({name: req.body.name, description: req.body.description},{where:{id}})

        res.status(200).json(result)    
    }
}

export default new CategoryController