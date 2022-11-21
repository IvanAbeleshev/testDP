import { Router } from 'express'
import userController from '../controllers/userController'
import { verifyToken } from '../middlewares/verifyToken'
import { verifyAdminRole } from '../middlewares/verifyAminRole'
import { param, body } from 'express-validator'
import { userRole } from '../interfaces'

const userRouter = Router()

userRouter.get('/getAll', verifyToken, userController.getAll)

userRouter.post('/', [body('login').isEmail().notEmpty(),
                      body('password').isString().isLength({min: 5}).notEmpty()], userController.signIn)
userRouter.post('/createUser', [body('login').isEmail().notEmpty(),
                                body('password').isString().isLength({min: 5}).notEmpty(),
                                body('role').isString().isIn([userRole.admin, userRole.user, userRole.guest])], userController.createUser)
userRouter.post('/checkUser', verifyToken, userController.checkUser)

userRouter.delete('/:id', [verifyToken, verifyAdminRole,
                          param('id').isInt()], userController.removeItem)


export default userRouter