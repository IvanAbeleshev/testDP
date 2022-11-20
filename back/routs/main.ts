import { Router } from 'express'
import blogRouter from './blogRouter'
import categoryRouter from './categoryRoute'
import userRouter from './userRoute'

const mainRouter = Router()

mainRouter.use('/users', userRouter)
mainRouter.use('/blogs', blogRouter)
mainRouter.use('/category', categoryRouter)

export default mainRouter