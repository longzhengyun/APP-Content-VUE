const Router = require('express')

const user = require('./user')
const product = require('./product')
const other = require('./other')

const router = Router()

router.use(user) // 登录、用户信息、认证
router.use(product) // 产品
router.use(other) // 其他

module.exports = router
