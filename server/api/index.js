import { Router } from 'express'

const router = Router()

// 验证登录状态
const checkLoginState = (req, res, callback) => {
    let uuid = req.cookies.uuid
    let token = req.cookies.token

    if (uuid && token && token.indexOf(uuid) === 0) {
        callback()
    } else {
        res.json({
            code: -1,
            message: '登录状态已失效',
            response: null
        })
    }
}

// 生成验证码
const getCode = (phone) => {
    return `${phone.substr(2, 1)}${phone.substr(5, 1)}${phone.substr(8, 1)}${phone.substr(10, 1)}`
}

// 获取token
router.post('/auth/token', (req, res) => {
    let data = {
        code: -1,
        message: '获取失败',
        response: null
    }
    let uuid = req.body.uuid

    if (uuid) {
        res.cookie('uuid', uuid, { // 设置cookie
            maxAge: 31536000000 // 一年后过期
        })
        data = {
            code: 0,
            message: '获取成功',
            response: null
        }
    }

    res.json(data)
})

// 获取验证码
router.post('/auth/code', (req, res) => {
    let data = {
        code: -1,
        message: '获取失败',
        response: null
    }
    let phone = req.body.phone

    if (phone && phone.length === 11) {
        data = {
            code: 0,
            message: '获取成功',
            response: {
                code: getCode(phone)
            }
        }
    }

    res.json(data)
})

// 登录
router.post('/auth/login', (req, res) => {
    let data = {
        code: -1,
        message: '登录失败',
        response: null
    }
    let uuid = req.cookies.uuid
    let phone = req.body.phone
    let code = req.body.code

    if (!phone || phone.length !== 11) {
        data.message = '手机号错误'
    } else if (!code || code.length !== 4 || code !== getCode(phone)) {
        data.message = '验证码错误'
    } else {
        res.cookie('token', `${uuid}${phone}`, { // 设置cookie
            maxAge: 31536000000 // 一年后过期
        })
        data = {
            code: 0,
            message: '登录成功',
            response: null
        }
    }
    res.json(data)
})

// 退出登录
router.post('/auth/logout', (req, res) => {
    let data = {
        code: 0,
        message: '退出登录成功',
        response: null
    }
    res.cookie('token', '', { // 设置cookie
        maxAge: 31536000000 // 一年后过期
    })
    res.json(data)
})

// 获取用户信息
router.post('/user/info', (req, res) => {
    checkLoginState(req, res, () => {
        res.json({
            code: 0,
            message: '获取用户信息成功',
            response: {
                phone: req.cookies.token.substr(-11, 11)
            }
        })
    })
})

// 获取用户信息
router.post('/app/indexData', (req, res) => {
    checkLoginState(req, res, () => {
        res.json({
            code: 0,
            message: '获取数据成功',
            response: {
                banner: [
                    {
                        title: '首页轮播图1',
                        image_url: 'https://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=c1d43fd26a061d957d133f3e4bc426e9/5366d0160924ab18fffea7dd31fae6cd7a890b6b.jpg',
                        jump_url: 'https://www.baidu.com',
                        jump_type: 1
                    },
                    {
                        title: '首页轮播图2',
                        image_url: 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=d5f42a97b67eca80125031e1a113bbe5/7af40ad162d9f2d330c9a85bafec8a136227ccae.jpg',
                        jump_url: 'https://www.baidu.com',
                        jump_type: 1
                    },
                    {
                        title: '首页轮播图3',
                        image_url: 'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/faf2b2119313b07e6077d3bc0ad7912396dd8cb8.jpg',
                        jump_url: 'https://www.baidu.com',
                        jump_type: 1
                    }
                ],
                alert: {
                    title: '首页弹出广告',
                    image_url: 'https://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1206/11/c0/11958819_1339405691592.jpg',
                    jump_url: 'https://www.baidu.com',
                    jump_type: 1
                }
            }
        })
    })
})

export default router
