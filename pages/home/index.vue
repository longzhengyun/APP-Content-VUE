<template>
  <div class="home-wrap">
    <!-- <mescroll-component :down="mescrollDown" @init="mescrollInit"> -->
      <!-- <template v-if="indexData">
        <div class="banner-wrap">
          <banner-component v-if="indexData.top_banner" class="banner" :data="indexData.top_banner" @callback="clickCallback" />
        </div>
        <div class="index-category border-bottom-line">
          <category-component :data="indexData.ad_list" v-if="indexData && indexData.ad_list" @callback="clickCallback" />
        </div>
        <scroll-component :data="scrollData" />
        <product-item-component class="index-hot" :categoryId="indexData.hot_category_id" :data="indexHotProduct" @callback="platformClick" />
        <hot-list-component title="热门推荐" :categoryId="indexData.hot_category_id" :data="indexData.hot_platforms" :productFrom="'home'" @callback="platformClick" />
      </template> -->
    <!-- </mescroll-component> -->
    <!-- <template v-if="popAdData">
      <pop-ad-component :popAdData="popAdData" @callback="clickCallback" />
    </template> -->
  </div>
</template>

<script>
    // import MescrollComponent from 'mescroll.js/mescroll.vue'
    // import BannerComponent from './../../components/common/Banner'
    // import PopAdComponent from './../../components/product/PopAd'

    export default {
        data () {
            return {
                mescroll: null,
                mescrollDown: {
                    callback: this.downCallback
                },
                indexData: null
            }
        },
        head () {
            return {
                title: '首页'
            }
        },
        mounted () {},
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback (mescroll) {
                if (this.indexData) {
                    this.indexData.banner = []
                }
                this.$axios.post('/api/app/indexData').then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.indexData = data.response || {}

                        this.$nextTick(() => {
                            // setTimeout(() => {
                            //     window.productExposure.init({
                            //         wrapId: 'mescroll',
                            //         domClass: '.list-product .list-item',
                            //         callback: (value) => {
                            //             console.log(value)
                            //         }
                            //     }) // 监听热门产品曝光信息
                            // }, 100)
                            // mescroll.endSuccess()
                        })
                    } else {
                        // mescroll.endErr()
                    }
                }).catch((error) => {
                    mescroll.endErr(error)
                })
            },
            clickCallback (item, index, name) {
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
            }
        },
        beforeDestroy () {
            if (this.mescroll) {
                this.mescroll.destroy()
                this.mescroll = null
            }
        },
        components: {
            // MescrollComponent
            // BannerComponent,
            // CategoryComponent,
            // ProductItemComponent,
            // HotListComponent,
            // ScrollComponent,
            // PopAdComponent
        }
    }
</script>

<style scoped>
    .home-wrap{display:flex;flex-direction:column;flex:1;}

    .banner-wrap{height:1.68rem;margin:.2rem .3rem;}
    .banner{position:relative;height:1.68rem;overflow:hidden;}
    .index-category{margin-top:.25rem;padding:0 .3rem;background-color:#fff;position: relative;}

    .index-hot{border-top:.2rem solid #f2f2f2;border-bottom:.2rem solid #f2f2f2;}
</style>
