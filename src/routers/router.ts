import {Router} from "express"
import createCardRouter from "./createCardRouter.js"

const router = Router()

router.use(createCardRouter)

export default router