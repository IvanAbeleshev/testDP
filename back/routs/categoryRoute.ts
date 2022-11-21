import { Router } from 'express'
import categoryController from '../controllers/categoryController'
import { verifyToken } from '../middlewares/verifyToken'
import { verifyAdminRole } from '../middlewares/verifyAminRole'
import { param, body, query } from 'express-validator'

const categoryRouter = Router()
categoryRouter.get('/getAll', verifyToken, categoryController.getAllWithoutPagination)
categoryRouter.get('/', [verifyToken,
                            query('page').isInt(),
                            query('limit').isInt()], categoryController.getAll)
categoryRouter.get('/:id', [verifyToken, param('id').isInt()], categoryController.getOne)

categoryRouter.post('/', [verifyToken, verifyAdminRole, 
                            body('name').isString().notEmpty(),
                            body('description').isString()], categoryController.create)

categoryRouter.post('/:id', [verifyToken, verifyAdminRole,
                            param('id').isInt(),
                            body('name').isString().notEmpty(),
                            body('description').isString()], categoryController.changeOne)

categoryRouter.delete('/:id', [verifyToken, verifyAdminRole, param('id').isInt()], categoryController.removeItem)

export default categoryRouter