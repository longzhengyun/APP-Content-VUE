<template>
    <section class="container" v-if="showLogin">
        <div class="form-cont">
            <div class="user-icon"><img class="img" src="/img/common/default_avatar.png" alt="" /></div>
            <div class="form-mode">
                <div class="mode-item">
                    <label class="item-value"><input class="item-input" type="tel" placeholder="请输入手机号" maxlength="11" v-model="formData.phone" /></label>
                </div>
                <div class="mode-item">
                    <label class="item-value"><input class="item-input" type="tel" placeholder="请输入验证码" maxlength="4" v-model="formData.code" /></label>
                    <span class="btn-code" :class="{'disable': !getCodeState}" @click="getCode">{{checkCodeText}}</span>
                </div>
            </div>
            <div class="form-submit">
                <span class="btn-submit" :class="{ 'disable': !submitState }" @click="submitData">登录</span>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data () {
            return {
                showLogin: false,
                phoneState: false,
                codeState: false,
                getCodeState: false,
                submitState: false,
                token: '',
                checkCodeText: '获取验证码',
                formData: {
                    phone: '',
                    code: ''
                },
                timer: null
            }
        },
        head () {
            return {
                title: '登录'
            }
        },
        watch: {
            formData: {
                handler: function (val, oldVal) {
                    this.formValidation()
                },
                deep: true
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
        mounted () {
            // 监听客户端发送的数据
            this.RNSendMessage()

            // 验证是否登录
            let token = localStorage.getItem('token') // 获取本地存储token
            this.getUserInfo(token)

            // 添加service worker
            this.addPWA()
        },
        methods: {
            getUuid () {
                // 重置上次登录数据
                this.$store.commit('userInfo', {
                    state: false,
                    avatar: '',
                    body_id: null,
                    name: '',
                    user_id: null,
                    user_phone: '',
                    uuid: ''
                })

                let uuid = localStorage.getItem('DeviceID')
                if (uuid) {
                    this.getToken(uuid) // 获取token
                } else {
                    this.retryGetUuid() // 重试获取uuid
                }
            },
            retryGetUuid () {
                let count = 1
                let timer = setInterval(() => {
                    let uuid = localStorage.getItem('DeviceID')
                    count++
                    if (count > 5) {
                        clearInterval(timer)
                        timer = null
                    }
                    if (uuid) {
                        clearInterval(timer)
                        timer = null
                        this.getToken(uuid) // 获取token
                    }
                }, 1000)
            },
            getToken (uuid) {
                // 获取token
                this.$axios.post('/api/auth/token', {
                    para: { uuid }
                }).then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.token = data.response.token
                    } else {
                        console.log(data.message)
                    }
                })
            },
            formValidation () {
                let phoneReg = /^1[3-9][0-9]{9}$/
                if (this.formData.phone && this.formData.phone.length === 11 && phoneReg.test(this.formData.phone)) {
                    this.phoneState = true
                    this.getCodeState = true
                } else {
                    this.phoneState = false
                    this.getCodeState = false
                }
                if (this.formData.code && this.formData.code.length === 4) {
                    this.codeState = true
                } else {
                    this.codeState = false
                }
                if (this.phoneState && this.codeState) {
                    this.submitState = true
                } else {
                    this.submitState = false
                }
            },
            getCode () {
                if (this.getCodeState) {
                    this.$axios.post('/api/user/code', {
                        head: { token: this.token },
                        para: { phone: this.formData.phone }
                    }).then((res) => {
                        let data = res.data
                        this.$toast.show(data.message)
                        if (data.code === 0) {
                            this.countDown() // 倒计时
                        }
                    })
                }
            },
            countDown () {
                let defaultText = this.checkCodeText
                let count = 60
                this.getCodeState = false
                this.checkCodeText = count + 's'
                this.timer = setInterval(() => {
                    this.getCodeState = false
                    if (count <= 1) {
                        clearInterval(this.timer)
                        this.checkCodeText = defaultText
                        this.getCodeState = true
                    } else {
                        count--
                        this.checkCodeText = count + 's'
                    }
                }, 1000)
            },
            submitData () {
                if (this.submitState) {
                    this.submitState = false // 禁止连续点击
                    this.$axios.post('/api/auth/login', {
                        head: { token: this.token },
                        para: this.formData
                    }).then((res) => {
                        let data = res.data
                        this.$toast.show(data.message)
                        if (data.code === 0) {
                            localStorage.setItem('token', data.response.token) // 本地存储token
                            this.getUserInfo(data.response.token)
                        } else {
                            this.submitState = true // 登录失败，允许重试
                        }
                    })
                }
            },
            getUserInfo (token) {
                this.$axios.post('/api/user/info', {
                    head: { token }
                }).then((res) => {
                    let data = res.data

                    this.getDeviceInfo() // 获取客户端信息

                    if (data.code === 0) {
                        this.$store.commit('userInfo', data.response)

                        let path = this.$route.query.redirect ? this.$route.query.redirect : '/home'
                        this.$router.replace({ path })
                    } else {
                        this.showLogin = true
                        this.getUuid() // 获取设备id
                    }
                })
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
                        this.$store.commit('appVersion', deviceInfoResult.version)
                        this.setCookie('version', deviceInfoResult.version, 365)
                        this.setCookie('utm_source', deviceInfoResult.utmSource, 365)
                        localStorage.setItem('DeviceID', deviceInfoResult.DeviceID)
                    }
                }
            },
            getDeviceInfo () {
                this.RNPostMessage(() => {
                    window.postMessage(JSON.stringify({ deviceInfoConfig: true }), '*')
                })
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
            clearInterval(this.timer)
            this.timer = null

            document.removeEventListener('message', this.setAppPostMessage, false) // 离开时清除监听方法
        }
    }
</script>

<style scoped>
    .form-cont{padding-top:1.14rem;min-height:7.6rem;}

    .user-icon{margin:0 auto .6rem auto;width:1.52rem;height:1.52rem;border-radius:100%;overflow:hidden;border:.06rem solid rgba(232, 208, 166, .3);}
    .user-icon .img{display:block;width:100%;height:100%;}

    .form-mode{margin-bottom:.2rem;padding:0 .3rem;}
    .form-mode .mode-item{position:relative;margin-bottom:.2rem;border-radius:.52rem;border:1px solid #e1e1e1;}
    .form-mode .mode-item .item-value{position:relative;z-index:5;display:block;height:.52rem;padding:.2rem 0;font-size:.28rem;}
    .form-mode .mode-item .item-input{display:block;width:100%;height:100%;text-indent:.3rem;}
    .form-mode .mode-item .item-input::-webkit-input-placeholder{color:#ccc;}
    .form-mode .mode-item .btn-code{position:absolute;right:.3rem;top:50%;z-index:9;transform:translateY(-50%);color:#666;}
    .form-mode .mode-item .btn-code.disable{color:#cbcbcb;}

    .form-submit{padding:.4rem .3rem;}
    .form-submit .btn-submit{display:block;height:.94rem;line-height:.94rem;text-align:center;border-radius:.94rem;background:linear-gradient(to right, rgb(190,159,102), rgb(215,187,140));color:#fff;font-size:.34rem;}
    .form-submit .btn-submit.disable{opacity:.7;}
</style>