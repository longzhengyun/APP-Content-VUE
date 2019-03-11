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
        async asyncData ({ params }) {
            return {
                productId: params.id
            }
        },
        head () {
            return {
                title: '产品详情'
            }
        },
        data () {
            return {
                mescroll: null,
                mescrollDown: {
                    callback: this.downCallback
                },
                detailData: null
            }
        },
        computed: {
            headerConfig () {
                return this.$store.state.headerConfig
            }
        },
        mounted () {
            this.$loading.show() // 首次加载显示loading
        },
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
                    this.$loading.hide() // 加载成功，隐藏loading

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
                    this.$loading.hide() // 加载失败，隐藏loading
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

<style scoped>
    .index-banner{height:1.68rem;padding:.25rem .3rem 0 .3rem;background-color:#fff;}
    .index-banner .banner{position:relative;height:1.68rem;overflow:hidden;}

    .index-category{padding:.25rem .3rem 0 .3rem;background-color:#fff;}

    .index-hot{margin:.2rem 0;}
</style>