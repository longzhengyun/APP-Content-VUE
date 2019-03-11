<template>
    <section class="section-wrap">
        <mescroll-component :down="mescrollDown" @init="mescrollInit"></mescroll-component>
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'

    export default {
        name: 'productDetail',
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
        computed: {},
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback (mescroll) {
                this.$axios.post('/api/platform/online-data').then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.indexData = data.response
                        this.indexHotProduct = this.indexData.hot_platforms.shift() // 删除第一个产品，赋值给热门产品

                        this.$nextTick(() => {
                            setTimeout(() => {
                                window.productExposure.init({
                                    wrapId: 'mescroll',
                                    domClass: '.index-hot',
                                    callback: (value) => {
                                        this.platformExposure({
                                            platform_id: value.id,
                                            campaign_url: value.campaignurl,
                                            category_id: this.indexData.hot_category_id
                                        })
                                    }
                                }) // 监听推荐产品曝光信息
                                window.productExposure.init({
                                    wrapId: 'mescroll',
                                    domClass: '.list-product .list-item',
                                    callback: (value) => {
                                        this.platformExposure({
                                            platform_id: value.id,
                                            campaign_url: value.campaignurl,
                                            category_id: this.indexData.hot_category_id
                                        })
                                    }
                                }) // 监听热门产品曝光信息
                            }, 100)
                            mescroll.endSuccess()
                        })
                    } else {
                        mescroll.endErr()
                    }
                }).catch((error) => {
                    mescroll.endErr(error)
                })
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