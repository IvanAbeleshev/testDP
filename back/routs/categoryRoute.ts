import { Router } from 'express'
import categoryController from '../controllers/categoryController'
import { verifyToken } from '../middlewares/verifyToken'
import { verifyTokenByAdminRole } from '../middlewares/verifyTokenByAminRole'

const categoryRouter = Router()
categoryRouter.get('/getAll', verifyToken, categoryController.getAllWithoutPagination)
categoryRouter.get('/', verifyToken, categoryController.getAll)
categoryRouter.get('/:id', verifyToken, categoryController.getOne)


categoryRouter.post('/', verifyTokenByAdminRole, categoryController.create)
categoryRouter.post('/:id', verifyTokenByAdminRole, categoryController.changeOne)

categoryRouter.delete('/:id', verifyTokenByAdminRole, categoryController.removeItem)

export default categoryRouter