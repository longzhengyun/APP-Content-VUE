import { Router } from 'express'

import { axiosPost } from './../apiConfig'

const router = Router()

// 获取token
router.post('/auth/token', (req, res) => {
    axiosPost('/auth/token', req, res)
})

// 登录
router.post('/auth/login', (req, res) => {
    axiosPost('/auth/login', req, res, (data) => {
        if (data.code === 0) {
            res.cookie('token', data.response.token, { // 设置cookie
                maxAge: 31536000000 // 一年后过期
            })
        }
    })
})

// 退出登录
router.post('/auth/logout', (req, res) => {
    axiosPost('/auth/logout', req, res)
})

// 获取登录验证码
router.post('/user/add-device-info', (req, res) => {
    axiosPost('/user/add-device-info', req, res)
})

// 获取登录验证码
router.post('/user/code', (req, res) => {
    axiosPost('/user/code', req, res)
})

// 获取登录状态
router.post('/user/is-login', (req, res) => {
    axiosPost('/user/is-login', req, res)
})

// 获取用户信息
router.post('/user/info', (req, res) => {
    axiosPost('/user/info', req, res, (data) => {
        if (data.code === 0) {
            res.cookie('token', req.body.head.token, { // 设置cookie
                maxAge: 31536000000 // 一年后过期
            })
        }
    })
})

export default router
