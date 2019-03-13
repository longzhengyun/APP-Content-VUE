<template>
    <nuxt />
</template>

<script>
    import { swVersion } from './../package'
    import { setHeaderConfigAction } from './../assets/js/setAppConfig'

    export default {
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            },
            headerConfig () {
                return this.$store.state.headerConfig
            }
        },
        mounted () {
            this.getUserInfo() // 获取用户登录信息

            this.RNSendMessage() // 监听客户端发送的数据

            setTimeout(() => {
                this.RNPostMessage(() => {
                    this.getDeviceInfo() // 获取客户端信息
                })
            }, 100)

            this.addPWA() // 添加service worker
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': function (val, oldVal) {
                if (val.name !== 'product-id') { // 排除产品详情
                    // 路由变化时向客户端发送当前路由信息
                    window.postMessage(JSON.stringify({
                        route: val.name,
                        headerConfig: Object.assign({}, this.headerConfig, setHeaderConfigAction(val.name))
                    }), '*')
                }

                if (val.name !== 'index' && oldVal.name === 'index' && !this.userInfo) {
                    this.$router.replace({ path: '/' })
                }
            }
        },
        methods: {
            getUserInfo () {
                // 未登录跳转登录页
                if (this.$route.name !== 'index' &&
                this.$route.name.indexOf('activities') !== 0 &&
                !this.userInfo) {
                    this.$axios.post('/api/user/info').then((res) => {
                        let data = res.data
                        if (data.code === 0) {
                            this.$store.commit('userInfo', data.response)
                        } else {
                            this.$router.replace({ path: '/', query: { redirect: this.$route.fullPath } }) // 未登录，跳转登录页
                        }
                    })
                }
            },
            getDeviceInfo () {
                window.postMessage(JSON.stringify({ deviceInfoConfig: true }), '*')
            },
            RNSendMessage () {
                // 监听RN postMessage传递的数据，注意使用document
                document.addEventListener('message', this.setAppPostMessage, false)
            },
            setAppPostMessage (event) {
                let message = event.data
                if (message) {
                    message = JSON.parse(message)

                    // 获取客户端信息
                    if (message.deviceInfoResult) {
                        let deviceInfoResult = message.deviceInfoResult
                        this.setCookie('version', deviceInfoResult.version, 365)
                        this.setCookie('utm_source', deviceInfoResult.utmSource, 365)
                        localStorage.setItem('DeviceID', deviceInfoResult.DeviceID)
                    }

                    // 客户端点击事件
                    if (message.actionResult) {
                        let actionResult = message.actionResult
                        if (actionResult.key === 'set') {
                            this.$router.push({ path: '/mine/set' })
                        }
                    }
                }
            },
            RNPostMessage (init) {
                const whenRNPostMessageReady = (cb) => { // 监听RN postMessage初始化是否完成
                    if (window && window.postMessage.length > 0) {
                        cb()
                    } else {
                        window.setTimeout(() => {
                            whenRNPostMessageReady(cb)
                        }, 1000)
                    }
                }

                whenRNPostMessageReady(init)
            },
            setCookie (key, value, time) {
                let date = new Date() // 获取当前时间
                date.setTime(date.getTime() + time * 24 * 3600 * 1000) // 将date设置为time天以后，并格式化为cookie识别的时间
                document.cookie = `${key}=${value};expires=${date.toGMTString()};path=/` // 设置cookie
            },
            addPWA () {
                document.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault() // 阻止默认安装事件
                    return false
                })

                // 注册serviceWorker
                if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                    navigator.serviceWorker.register('/serviceWorker.js').then((registration) => { // 注意SW文件的相对路径 ./ 和绝对路径 / 的区别
                        if (localStorage.getItem('swVersion') !== swVersion) { // 解决因为服务器缓存serviceWorker.js导致的serviceWorker不更新问题
                        registration.update().then(() => {
                            localStorage.setItem('swVersion', swVersion)
                        })
                        }
                        console.log('ServiceWorker registration successful with scope: ', registration.scope) // 注册成功
                    }).catch((err) => {
                        console.log('ServiceWorker registration failed: ', err) // 注册失败
                    })
                }
            }
        },
        beforeDestroy () {
            document.removeEventListener('message', this.setAppPostMessage, false) // 离开时清除监听方法
        }
    }
</script>
