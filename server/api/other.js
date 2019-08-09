const Router = require('express')

const { axiosPost } = require('./../apiConfig')

const router = Router()

// app升级
router.post('/app/upgrade', (req, res) => {
    axiosPost('/app/upgrade', req, res)
})

module.exports = router
