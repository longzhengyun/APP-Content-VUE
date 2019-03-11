<template>
    <section class="section-wrap">
        <mescroll-component :down="mescrollDown" @init="mescrollInit" id="mescroll">
            <template v-if="indexData">
                <div class="index-banner">
                    <banner-component v-if="indexData.top_banner" class="banner" :data="indexData.top_banner" @callback="clickCallback" />
                </div>
                <div class="index-category">
                    <category-component :data="indexData.ad_list" v-if="indexData && indexData.ad_list" @callback="clickCallback" />
                </div>
                <product-item-component class="index-hot" :data="indexHotProduct" />
                <hot-list-component title="热门推荐" :data="indexData.hot_platforms" />
            </template>
        </mescroll-component>
        <menu-component :menuConfig="menuConfig" />
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'
    import BannerComponent from './../../components/common/Banner'
    import MenuComponent from './../../components/common/Menu'
    import HotListComponent from './../../components/common/HotList'
    import CategoryComponent from './../../components/product/Category'
    import ProductItemComponent from './../../components/product/ProductItem'

    export default {
        name: 'home',
        head () {
            return {
                title: '首页'
            }
        },
        data () {
            return {
                mescroll: null,
                mescrollDown: {
                    callback: this.downCallback
                },
                indexData: null,
                indexHotProduct: null
            }
        },
        computed: {
            menuConfig () {
                return Object.assign({}, this.$store.state.menuConfig, { currentIndex: 0 })
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
                if (this.indexData) {
                    this.indexData.top_banner = [] // 清除数据，解决swiper组件缓存图片问题
                }

                this.$axios.post('/api/platform/online-data').then((res) => {
                    this.$loading.hide() // 加载成功，隐藏loading

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
                    this.$loading.hide() // 加载失败，隐藏loading
                    mescroll.endErr(error)
                })

                this.$axios.post('/api/app/alert-advertise').then((res) => {
                    let data = res.data
                    if (data.code === 0 && data.response.alert_ad) {
                        this.popAdData = data.response.alert_ad
                    }
                })
            },
            clickCallback (item) {
                if (item.jump_type === 2) {
                    this.$router.push({ path: `/category/${item.category}` })
                } else {
                    if (!item.jump_url) return false
                    let targetViewConfig = {
                        title: item.title,
                        jumpUrl: item.jump_url
                    }
                    window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
                }
            },
            platformExposure (para) {
                this.$axios.post('/api/platform/exposure', { para }, { timeout: 1000 })
            }
        },
        beforeDestroy () {
            if (this.mescroll) {
                this.mescroll.destroy()
                this.mescroll = null
            }
        },
        components: {
            MescrollComponent,
            BannerComponent,
            MenuComponent,
            CategoryComponent,
            ProductItemComponent,
            HotListComponent
        }
    }
</script>

<style scoped>
    .section-wrap{background-color:#f2f2f2;}

    .index-banner{height:1.68rem;padding:.25rem .3rem 0 .3rem;background-color:#fff;}
    .index-banner .banner{position:relative;height:1.68rem;overflow:hidden;}

    .index-category{padding:.25rem .3rem 0 .3rem;background-color:#fff;}

    .index-hot{margin:.2rem 0;}
</style>