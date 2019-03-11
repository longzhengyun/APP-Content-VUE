<template>
    <div class="filter-wrap" :class="{'mask' : activeTabIndex !== null}" @click="clickMakHidden">
        <ul class="filter-tab border-bottom-line">
            <li class="tab-item" :style="{ 'max-width': 100 / selectData.length + '%' }" :class="{'active' : activeTabIndex === key}" v-for="(item, key) in filterTabData" :key="key" @click="showContAction(key)">{{item.name}}<span class="arrow" :class="{'down' : activeTabIndex !== key, 'up' : activeTabIndex === key}"></span></li>
        </ul>
        <div class="filter-cont" :class="{ 'android-full-screen' : isFullScreen }" v-if="showCont" @click="hideFilterCont">
            <ul class="filter-list overflow-y">
                <li class="list-item" :class="{'active' : key === activeContIndex}" v-for="(item, key) in filterContData" :key="key" @click="selectContAction(item, key)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'FilterTab',
        props: ['filterData', 'selectData'],
        data () {
            return {
                showCont: false,
                activeTabIndex: null,
                activeContIndex: 0,
                filterSelectValue: [],
                filterContData: []
            }
        },
        computed: {
            filterTabData () {
                let filterTabData = []
                if (this.selectData.length) {
                    this.selectData.map((val, index) => {
                        filterTabData.push(this.filterData[index][val])
                    })
                    this.filterSelectValue = this.selectData
                } else {
                    this.filterData.map((val, index) => {
                        filterTabData.push(val[0])
                    })
                }
                return filterTabData
            }
        },
        mounted () {
            this.checkFullScreen() // 判断是否为安卓全面屏
        },
        methods: {
            showContAction (key) {
                if (this.activeTabIndex === key) {
                    this.hiddenCont()
                } else {
                    this.activeTabIndex = key
                    this.showCont = true
                    this.filterContData = this.filterData[key]
                    this.$emit('changeMescrollState', true) // 锁定下拉刷新
                }
                this.activeContIndex = this.filterSelectValue[key]
            },
            selectContAction (item, key) {
                this.activeContIndex = key
                this.filterSelectValue[this.activeTabIndex] = key
                this.filterTabData[this.activeTabIndex] = item
                this.updateFilterConfig()
                this.hiddenCont()
            },
            updateFilterConfig () {
                this.$emit('changeSelectData', this.filterSelectValue)
            },
            hideFilterCont (e) {
                if (e.target.className.indexOf('filter-cont') >= 0) {
                    this.hiddenCont()
                }
            },
            hiddenCont () {
                if (this.showCont) {
                    this.activeTabIndex = null
                    this.showCont = false
                    this.filterContData = []
                    this.$emit('changeMescrollState', false) // 解锁下拉刷新
                }
            },
            clickMakHidden () {
                if (event.toElement.className === 'filter-wrap border-top-line mask') {
                    this.hiddenCont()
                }
            },
            checkFullScreen () {
                let system = this.checkSystem(window.navigator.userAgent)
                if (system === 'android' && screen.height / screen.width >= 2) {
                    this.isFullScreen = true
                } else {
                    this.isFullScreen = false
                }
            },
            checkSystem (u) {
                let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
                let isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
                if (isAndroid) {
                    return 'android'
                } else if (isIos) {
                    return 'iOS'
                }
            }
        }
    }
</script>
<style scoped>
    .filter-wrap{height:.9rem;}
    .filter-wrap.mask{height:auto;}
    .filter-tab{position:relative;display:flex;z-index:5;background-color:#fff;}
    .filter-tab .tab-item{flex:1;position:relative;margin:0 .3rem;text-align:center;line-height:.9rem;font-size:.28rem;white-space:nowrap;font-weight:bold;text-overflow:ellipsis;overflow:hidden;}
    .filter-tab .tab-item:first-child{text-align:left;}
    .filter-tab .tab-item:last-child{text-align:right;}
    .filter-tab .tab-item .arrow{position:relative;display:inline-block;width:.2rem;margin-left:.05rem;}
    .filter-tab .tab-item .arrow::after{content:'';position:absolute;top:0;left:0;width:0;height:0;border:.1rem solid transparent;border-radius:.05rem;}
    .filter-tab .tab-item .arrow.up::after{border-bottom-color:#c1a36b;transform:translateY(-120%);}
    .filter-tab .tab-item .arrow.down::after{border-top-color:#999;transform:translateY(-70%);}
    .filter-tab .tab-item.active{color:#c1a36b;}
    .filter-cont{position:fixed;top:.9rem;left:0;right:0;bottom:0;z-index:599;background-color:rgba(0, 0, 0, .7);}
    .filter-cont .filter-list.overflow-y{background-color:#fff;max-height:100%;overflow-y:auto;}
    .filter-cont .list-item{position:relative;padding:0 .3rem;line-height:.8rem;font-size:.28rem;}
    .filter-cont .list-item.active{color:#c1a36b;font-weight:bold;}
    .filter-cont .list-item.active::after{content:'';position:absolute;top:50%;right:.3rem;transform:translateY(-50%);width:.32rem;height:.32rem;background:url(/img/product/icon_selected.png) no-repeat;background-size:cover;}
</style>