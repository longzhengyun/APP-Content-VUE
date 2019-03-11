import { Router } from 'express'

import { axiosPost } from '../apiConfig'

const router = Router()

// 获取首页数据
router.post('/platform/online-data', (req, res) => {
    axiosPost('/platform/online-data', req, res)
})

// 获取首页弹出广告
router.post('/app/alert-advertise', (req, res) => {
    axiosPost('/app/alert-advertise', req, res)
})

// 获取全部产品
router.post('/platform/all-online', (req, res) => {
    axiosPost('/platform/all-online', req, res)
})

// 获取产品详情
router.post('/platform/detail', (req, res) => {
    axiosPost('/platform/detail', req, res)
})

// 获取分类详情
router.post('/platform/category-detail', (req, res) => {
    axiosPost('/platform/category-detail', req, res)
})

// 优选产品
router.post('/platform/recommend', (req, res) => {
    axiosPost('/platform/recommend', req, res)
})

// 点击事件
router.post('/platform/click', (req, res) => {
    axiosPost('/platform/click', req, res)
})

// 曝光事件
router.post('/platform/exposure', (req, res) => {
    axiosPost('/platform/exposure', req, res)
})

export default router
