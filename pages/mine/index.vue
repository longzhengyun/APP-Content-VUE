<template>
    <section class="section-wrap">
        <mescroll-component :down="mescrollDown" @init="mescrollInit" id="mescroll">
            <user-info-component :data="userInfo" />
            <hot-list-component :data="hotListData" title="为您推荐" />
        </mescroll-component>
        <menu-component :menuConfig="menuConfig" />
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'
    import MenuComponent from './../../components/common/Menu'
    import HotListComponent from './../../components/common/HotList'
    import UserInfoComponent from './../../components/mine/UserInfo'

    export default {
        name: 'mine',
        async asyncData ({ $axios }) {
            let { data } = await $axios.post('/api/platform/recommend')
            return {
                hotListData: data.response
            }
        },
        head () {
            return {
                title: '我的'
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
            userInfo () {
                return this.$store.state.userInfo
            },
            menuConfig () {
                return Object.assign({}, this.$store.state.menuConfig, { currentIndex: 2 })
            }
        },
        mounted () {
            this.initProductExposure() // 初始化产品曝光
        },
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback (mescroll) {
                this.$axios.post('/api/platform/recommend').then((res) => {
                    let data = res.data
                    if (data.code === 0) {
                        this.hotListData = data.response

                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.initProductExposure() // 初始化产品曝光
                            }, 100)

                            mescroll.endSuccess()
                        })
                    } else {
                        mescroll.endErr()
                    }
                }).catch((error) => {
                    mescroll.endErr(error)
                })
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
        components: {
            MescrollComponent,
            MenuComponent,
            HotListComponent,
            UserInfoComponent
        }
    }
</script>

<style scoped>
    .section-wrap{background-color:#f2f2f2;}
</style>