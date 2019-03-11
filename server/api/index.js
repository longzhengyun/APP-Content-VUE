import { Router } from 'express'

import user from './user'
import product from './product'
import other from './other'

const router = Router()

router.use(user) // 登录、用户信息、认证
router.use(product) // 产品
router.use(other) // 其他

export default router
