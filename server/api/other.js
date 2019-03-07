import { Router } from 'express'

import { axiosPost } from './../apiConfig'

const router = Router()

// app升级
router.post('/app/upgrade', (req, res) => {
    axiosPost('/app/upgrade', req, res)
})

export default router
