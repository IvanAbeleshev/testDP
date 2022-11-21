import { Router } from 'express'
import blogController from '../controllers/blogController'
import { verifyToken } from '../middlewares/verifyToken'
import { query, param, body } from 'express-validator'

const blogRouter = Router()

blogRouter.get('/', [verifyToken,
                    query('page').isInt(),
                    query('limit').isInt(),
                    query('userId').isInt(),
                    query('categoryId').isInt()], blogController.getAll)
blogRouter.get('/:id', [verifyToken,
                    param('id').isInt().notEmpty()], blogController.getOne)

blogRouter.post('/', [verifyToken,
                    body('title').isString().notEmpty(),
                    body('categoryId').isInt().notEmpty(),
                    body('text').isString().notEmpty()], blogController.addBlog)
blogRouter.post('/:id', [verifyToken,
                    param('id').isInt(),
                    body('title').isString().notEmpty(),
                    body('categoryId').isInt().notEmpty(),
                    body('text').isString().notEmpty()], blogController.changeItem)

blogRouter.delete('/:id', [verifyToken,
                    param('id').isInt()], blogController.removeItem )

export default blogRouter