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
            }
        }
    }
</script>
