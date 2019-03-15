<template>
    <section class="section-wrap">
        <mescroll-component :down="mescrollDown" @init="mescrollInit"></mescroll-component>
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'
    import { setHeaderConfigAction } from './../../assets/js/setAppConfig'

    export default {
        name: 'productDetail',
        validate ({ params }) {
            return /^\d+$/.test(params.id) // 路由参数校验，必须是number类型
        },
        async asyncData ({ params, $axios }) {
            let { data } = await $axios.post('/api/platform/detail', {
                para: {
                    id: params.id
                }
            })

            return {
                productId: params.id,
                detailData: data.response
            }
        },
        head () {
            return {
                title: this.detailData.name,
                meta: [
                    {
                        name: 'keywords',
                        content: this.detailData.name
                    },
                    {
                        name: 'description',
                        content: this.detailData.slogan
                    }
                ]
            }
        },
        data () {
            return {
                mescroll: null,
                mescrollDown: {
                    auto: false,
                    callback: this.downCallback
                }
            }
        },
        computed: {
            headerConfig () {
                return this.$store.state.headerConfig
            }
        },
        mounted () {},
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback (mescroll) {
                this.$axios.post('/api/platform/detail', {
                    para: {
                        id: this.productId
                    }
                }).then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.detailData = data.response

                        this.setDetailHeader() // 设置客户端产品详情头部信息

                        this.$nextTick(() => {
                            mescroll.endSuccess()
                        })
                    } else {
                        mescroll.endErr()
                    }
                }).catch((error) => {
                    mescroll.endErr(error)
                })
            },
            setDetailHeader () {
                window.postMessage(JSON.stringify({
                    route: this.$route.name,
                    headerConfig: Object.assign({}, this.headerConfig, {
                        title: this.detailData.name,
                        icon: this.detailData.icon,
                        showService: true
                    }, setHeaderConfigAction(this.$route.name))
                }), '*')
            }
        },
        beforeDestroy () {
            if (this.mescroll) {
                this.mescroll.destroy()
                this.mescroll = null
            }
        },
        components: {
            MescrollComponent
        }
    }
</script>

<style scoped></style>