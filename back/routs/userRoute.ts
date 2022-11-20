import { Router } from 'express'
import userController from '../controllers/userController'
import { verifyToken } from '../middlewares/verifyToken'
import { verifyTokenByAdminRole } from '../middlewares/verifyTokenByAminRole'

const userRouter = Router()

userRouter.get('/getAll', verifyToken, userController.getAll)

userRouter.post('/', userController.signIn)
userRouter.post('/createUser', userController.createUser)
userRouter.post('/checkUser', verifyToken, userController.checkUser)

userRouter.delete('/:id', verifyTokenByAdminRole, userController.removeItem)


export default userRouter