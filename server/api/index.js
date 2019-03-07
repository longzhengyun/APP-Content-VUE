import { Router } from 'express'

import user from './user'
import list from './list'
import other from './other'

const router = Router()

router.use(user) // 登录、用户信息、认证
router.use(list) // 列表
router.use(other) // 其他

export default router
