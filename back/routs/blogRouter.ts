import { Router } from 'express'
import blogController from '../controllers/blogController'
import { verifyToken } from '../middlewares/verifyToken'

const blogRouter = Router()

blogRouter.get('/', verifyToken, blogController.getAll)
blogRouter.get('/:id', verifyToken, blogController.getOne)

blogRouter.post('/', verifyToken, blogController.addBlog)
blogRouter.post('/:id', verifyToken, blogController.changeItem)

blogRouter.delete('/:id', verifyToken, blogController.removeItem )

export default blogRouter