import axios from 'axios'

let SERVER_URL = '' // api url

if (process.env.CONST_ENV === 'production') { // 生产环境
} else if (process.env.CONST_ENV === 'onlineTest') { // 线上测试环境
} else if (process.env.CONST_ENV === 'offlineTest') { // 线下测试环境
    SERVER_URL = 'http://192.168.20.13:8097/api'
} else { // 本地环境
    SERVER_URL = 'http://192.168.20.13:8097/api'
}

// 获取用户真实ip
const getClientIp = (req) => {
    let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || ''
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip
}

// 获取用户设备类型
const checkSystem = (u) => {
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    let isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isAndroid) {
        return 'android'
    } else if (isIos) {
        return 'iOS'
    }
}

// 设置head字段的值
const setHeadValue = (req) => {
    let defaultHead = {
        mdkey: '',
        utm_source: 'apk_test'
    }

    defaultHead.version = req.cookies.version ? req.cookies.version : '0.0.0'

    defaultHead.token = req.cookies.token ? req.cookies.token : null

    defaultHead.ua = req.headers['user-agent'] ? req.headers['user-agent'] : null
    if (defaultHead.ua) {
        defaultHead.partner = checkSystem(defaultHead.ua) // 获取设备类型
        defaultHead.utm_source = defaultHead.partner === 'android' ? 'android_official' : 'ios_official'
    }

    defaultHead.utm_source = req.cookies.utm_source ? req.cookies.utm_source : defaultHead.utm_source

    req.body.head = req.body.head ? Object.assign({}, defaultHead, req.body.head) : defaultHead
}

// 设置para字段的值
const setParaValue = (req) => {
    let defaultPara = {}
    req.body.para = req.body.para ? Object.assign({}, defaultPara, req.body.para) : defaultPara
}

// 通用请求接口方法
const axiosPost = (url, req, res, callback) => {
    if (req.headers.cookie) { // 传递cookie
        axios.defaults.headers.common['Cookie'] = req.headers.cookie
    }

    if (req.headers['user-agent']) { // 传递ua
        axios.defaults.headers.common['ua'] = req.headers['user-agent']
    }

    let ip = getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/) // 获取用户真实ip
    if (ip && ip.length > 0) {
        axios.defaults.headers.common['ip'] = ip[0]
    }

    setHeadValue(req) // 设置head数据
    setParaValue(req) // 设置para数据

    axios.defaults.baseURL = SERVER_URL // 设置默认api url

    axios.post(url, req.body).then((response) => {
        if (callback) {
            callback(response.data)
        }
        res.json(response.data)
    }).catch(err => {
        res.json(err)
    })
}

export { axiosPost, checkSystem }
