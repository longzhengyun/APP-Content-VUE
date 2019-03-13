<template>
    <section class="section-wrap">
        <ul class="set-list" v-if="userInfo">
            <li class="list-item border-bottom-line">
                <span class="item-name">头像</span>
                <span class="item-value"><img class="img" :src="userInfo.avatar ? userInfo.avatar : '/images/common/default_avatar.png'" /></span>
            </li>
            <li class="list-item border-bottom-line">
                <span class="item-name">昵称</span>
                <span class="item-value">{{userInfo.wxname || hiddenName(userInfo.user_phone)}}</span>
            </li>
            <li class="list-item list-check border-bottom-line" v-if="userInfo && userInfo.dd_show !== 0">
                <span class="item-name">检测新版本</span>
                <span class="item-update" @click="update" v-if="showUpdate">有更新</span>
                <span class="item-value" @click="appUpgrade">V {{appVersion}}<i class="arrow"></i></span>
            </li>
        </ul>
        <span class="sign-out" @click="signOut">退出登录</span>
    </section>
</template>

<script>
    export default {
        head () {
            return {
                title: '设置'
            }
        },
        data () {
            return {
                showUpdate: false,
                utmSource: '',
                appVersion: ''
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
        mounted () {
            this.getSource()
            this.getAppVersion()
        },
        methods: {
            // 获取APP渠道
            getSource () {
                this.utmSource = this.getCookie(document.cookie, 'utm_source')
            },
            getAppVersion () {
                this.appVersion = this.getCookie(document.cookie, 'version') || '0.0.0'
            },
            hiddenName (name) {
                if (name && name.length === 11) {
                    name = name.substr(0, 3) + '***' + name.substr(-4, 4)
                }
                return name
            },
            signOut () {
                this.$axios.post('/api/auth/logout').then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.$toast.show(data.message)
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 500)
                    }
                })
            },
            update () {
                let targetViewConfig = {
                    title: '贝壳多多',
                    jumpUrl: window.location.origin + `/activities/loandownload?utm_source=${this.utmSource}`
                }
                window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
            },
            appUpgrade () {
                this.$axios.post('/api/app/upgrade', {
                    para: {
                        'dd-version': this.appVersion
                    }
                }).then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        if (data.response.upgrade === 0) {
                            this.$toast.show('已经是最新版本')
                        } else {
                            this.showUpdate = true
                        }
                    } else {
                        this.$toast.show(data.message)
                    }
                })
            },
            getCookie (cookies, target) {
                let result = null
                let aCookie = cookies.split('; ')
                aCookie.forEach((value) => {
                    let aCrumb = value.split('=')
                    if (aCrumb[0] === target) {
                        result = unescape(aCrumb[1])
                    }
                })
                return result
            }
        }
    }
</script>

<style scoped>
    .container{position:relative;}

    .set-list{padding:0 .3rem;margin-bottom:.6rem;}
    .set-list .item-name,
    .set-list .item-update,
    .set-list .list-check .arrow{position:absolute;top:50%;transform:translateY(-50%);}
    .set-list .item-name{left:0;}
    .set-list .list-item{position:relative;padding:.24rem 0;text-align:right;}
    .set-list .item-value .img{display:inline-block;width:.96rem;height:.96rem;border-radius:100%;border:.06rem solid #e8d0a6;}
    .set-list .item-update{left:1.75rem;height:.49rem;line-height:.49rem;border-radius:1.58rem;padding:0 .25rem;background:linear-gradient(to right, rgb(190, 159, 102), rgb(215, 187, 140));font-size:.24rem;color:#fff;}
    .set-list .list-check .arrow{right:0;width:.25rem;height:.25rem;border:1px solid;border-color:#ccc #ccc transparent transparent;transform:translateY(-50%) rotate(45deg);}
    .set-list .list-check .item-value{padding-right:.25rem;}

    .sign-out{display:block;margin:0 .3rem;border:1px solid #af925d;border-radius:.12rem;text-align:center;line-height:.92rem;font-size:.34rem;color:#af925d;}
</style>
