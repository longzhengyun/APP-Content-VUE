<template>
    <section class="section-wrap">
        <div class="mescroll" v-if="showLogin">
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
        </div>
    </section>
</template>

<script>
    export default {
        name: 'login',
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
            // 验证是否登录
            let token = localStorage.getItem('token') // 获取本地存储token
            this.getUserInfo(token)
        },
        methods: {
            getUuid () {
                // 重置上次登录数据
                this.$store.commit('userInfo', null)

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

                    if (data.code === 0) {
                        this.$store.commit('userInfo', data.response)

                        let path = this.$route.query.redirect ? this.$route.query.redirect : '/home'
                        this.$router.replace({ path })
                    } else {
                        this.showLogin = true
                        this.getUuid() // 获取设备id
                    }
                })
            }
        },
        beforeDestroy () {
            clearInterval(this.timer)
            this.timer = null
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