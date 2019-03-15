<template>
    <section class="section-wrap">
        <mescroll-component :down="mescrollDown" @init="mescrollInit" id="mescroll">
            <nothing-component v-if="showNothing" />
            <list-product-component class="product-list" :categoryId="categoryId" :data="detailData.platform_list" v-else />
        </mescroll-component>
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'
    import NothingComponent from './../../components/common/Nothing'
    import ListProductComponent from './../../components/product/ListProduct'
    import { setHeaderConfigAction } from './../../assets/js/setAppConfig'

    export default {
        name: 'categoryDetail',
        validate ({ params }) {
            return /^\d+$/.test(params.id) // 路由参数校验，必须是number类型
        },
        async asyncData ({ params, $axios }) {
            let { data } = await $axios.post('/api/platform/category-detail', {
                para: {
                    category_id: params.id
                }
            })

            return {
                categoryId: params.id,
                detailData: data.response,
                showNothing: !(data.response.platform_list && data.response.platform_list.length > 0)
            }
        },
        head () {
            return {
                title: this.detailData.category_info.name
                // meta: [
                //     {
                //         name: 'keywords',
                //         content: this.detailData.category_info.name
                //     },
                //     {
                //         name: 'description',
                //         content: this.detailData.category_info.name
                //     }
                // ]
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
        mounted () {
            this.initProductExposure() // 初始化产品曝光
        },
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback () {
                this.$axios.post('/api/platform/category-detail', {
                    para: {
                        category_id: this.categoryId
                    }
                }).then((res) => {
                    let data = res.data

                    this.showNothing = !(data.response.platform_list && data.response.platform_list.length > 0)

                    if (data.code === 0) {
                        this.detailData = data.response

                        this.setDetailHeader() // 设置客户端产品详情头部信息

                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.initProductExposure() // 初始化产品曝光
                            }, 200)
                            this.mescroll.endSuccess(this.detailData.platform_list.length)
                        })
                    } else {
                        this.mescroll.endErr()
                    }
                }).catch((error) => {
                    this.mescroll.endErr(error)
                })
            },
            setDetailHeader () {
                window.postMessage(JSON.stringify({
                    route: this.$route.name,
                    headerConfig: Object.assign({}, this.headerConfig, {
                        title: this.detailData.category_info.name
                    }, setHeaderConfigAction(this.$route.name))
                }), '*')
            },
            initProductExposure () {
                window.productExposure.init({
                    wrapId: 'mescroll',
                    domClass: '.list-product .list-item',
                    callback: (value) => {
                        this.platformExposure({
                            platform_id: value.id,
                            campaign_url: value.campaignurl,
                            category_id: 0
                        })
                    }
                }) // 监听热门产品曝光信息
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
            ListProductComponent,
            NothingComponent
        }
    }
</script>
