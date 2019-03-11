<template>
    <section class="section-wrap">
        <filter-tab-component :filterData="filterData" :selectData="selectData" @changeSelectData="changeSelectData" @changeMescrollState="changeMescrollState" />
        <mescroll-component :down="mescrollDown" @init="mescrollInit" id="mescroll">
            <list-product-component class="product-list" :data="listData" v-if="listData.length > 0" />
            <nothing-component v-if="showNothing" />
        </mescroll-component>
        <menu-component :menuConfig="menuConfig" />
    </section>
</template>

<script>
    import MescrollComponent from 'mescroll.js/mescroll.vue'
    import MenuComponent from './../../components/common/Menu'
    import NothingComponent from './../../components/common/Nothing'
    import FilterTabComponent from './../../components/product/FilterTab'
    import ListProductComponent from './../../components/product/ListProduct'

    export default {
        name: 'product',
        head () {
            return {
                title: '产品大全'
            }
        },
        data () {
            return {
                mescroll: null,
                mescrollDown: {
                    callback: this.downCallback
                },
                showNothing: false,
                listData: [],
                filterConfig: {
                    amount_min: '0',
                    amount_max: '0',
                    day_min: '0',
                    day_max: '0',
                    sort_type: null
                },
                filterData: [
                    [
                        {
                            name: '额度不限',
                            amount_min: '0',
                            amount_max: '0'
                        },
                        {
                            name: '1千元以下',
                            amount_min: '0',
                            amount_max: '1000'
                        },
                        {
                            name: '1-2千元',
                            amount_min: '1000',
                            amount_max: '2000'
                        },
                        {
                            name: '2-5千元',
                            amount_min: '2000',
                            amount_max: '5000'
                        },
                        {
                            name: '5-8千元',
                            amount_min: '5000',
                            amount_max: '8000'
                        },
                        {
                            name: '8千元以上',
                            amount_min: '8000',
                            amount_max: '0'
                        }
                    ],
                    [
                        {
                            name: '期限不限',
                            day_min: '0',
                            day_max: '0'
                        },
                        {
                            name: '7天以内',
                            day_min: '0',
                            day_max: '7'
                        },
                        {
                            name: '7-14天',
                            day_min: '7',
                            day_max: '14'
                        },
                        {
                            name: '14-30天',
                            day_min: '14',
                            day_max: '30'
                        },
                        {
                            name: '1-3个月',
                            day_min: '30',
                            day_max: '90'
                        },
                        {
                            name: '3-6个月',
                            day_min: '90',
                            day_max: '180'
                        },
                        {
                            name: '6-12个月',
                            day_min: '180',
                            day_max: '360'
                        },
                        {
                            name: '1年以上',
                            day_min: '360',
                            day_max: '0'
                        }
                    ],
                    [
                        {
                            name: '默认排序',
                            sort_type: null
                        },
                        {
                            name: '利率最低',
                            sort_type: '1',
                            sort_value: '2'
                        }
                    ]
                ]
            }
        },
        computed: {
            menuConfig () {
                return Object.assign({}, this.$store.state.menuConfig, { currentIndex: 1 })
            },
            selectData () {
                return this.$store.state.productSelectData
            }
        },
        mounted () {
            this.$loading.show() // 首次加载显示loading
        },
        methods: {
            mescrollInit (mescroll) { // mescroll组件初始化的回调,可获取到mescroll对象
                this.mescroll = mescroll
            },
            downCallback () {
                this.changeSelectData(this.selectData)
            },
            changeSelectData (data) {
                this.$store.commit('productSelectData', data)
                let filterConfig = this.filterConfig
                this.selectData.map((val, index) => {
                    if (index === 0) {
                        filterConfig.amount_min = this.filterData[index][val].amount_min
                        filterConfig.amount_max = this.filterData[index][val].amount_max
                    }
                    if (index === 1) {
                        filterConfig.day_min = this.filterData[index][val].day_min
                        filterConfig.day_max = this.filterData[index][val].day_max
                    }
                    if (index === 2) {
                        filterConfig.sort_type = this.filterData[index][val].sort_type
                        if (filterConfig.sort_type) {
                            filterConfig.sort_value = this.filterData[index][val].sort_value
                        }
                    }
                })

                this.$axios.post('/api/platform/all-online', {
                    para: filterConfig
                }).then((res) => {
                    this.$loading.hide() // 加载成功，隐藏loading

                    let data = res.data
                    if (data.code === 0) {
                        this.listData = data.response || []
                        if (this.listData.length === 0) {
                            this.showNothing = true
                        } else {
                            this.showNothing = false
                        }

                        this.mescroll.scrollTo(0, 0) // 回到顶部

                        this.$nextTick(() => {
                            setTimeout(() => {
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
                            }, 100)
                            this.mescroll.endSuccess(data.response.length)
                        })
                    } else {
                        this.mescroll.endErr()
                    }
                }).catch((error) => {
                    this.$loading.hide() // 加载失败，隐藏loading
                    this.mescroll.endErr(error)
                })
            },
            changeMescrollState (state) {
                this.mescroll.lockDownScroll(state) // 修改下拉刷新锁定状态
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

            // 销毁前判断路由不是进入产品详情，重置筛选项
            if (this.$route.name !== 'product-id') {
                this.$store.commit('productSelectData', [0, 0, 0])
            }
        },
        components: {
            MescrollComponent,
            MenuComponent,
            NothingComponent,
            FilterTabComponent,
            ListProductComponent
        }
    }
</script>

<style scoped></style>