<template>
    <section v-if="headerConfig.showHeader" class="header-wrap" :class="{ 'android-full-screen' : isFullScreen }">
        <div v-if="headerConfig.showBack" class="header-icon header-back" @click="goBack"></div>
        <div v-if="headerConfig.showSet" class="header-icon header-set" @click="goSet"></div>
        <h2 class="header-title" v-if="productDetailHeader"><img :src="productDetailHeader.icon" class="img" /> {{productDetailHeader.name}}</h2>
        <h2 class="header-title" v-else-if="categoryDetailHeader">{{categoryDetailHeader.name}}</h2>
        <h2 class="header-title" v-else>{{headerConfig.title}}</h2>
    </section>
</template>

<script>
export default {
    name: 'Header',
    props: ['headerConfig'],
    data () {
        return {
            isFullScreen: false
        }
    },
    computed: {
        productDetailHeader () {
            return this.$store.state.productDetailHeader
        },
        categoryDetailHeader () {
            return this.$store.state.categoryDetailHeader
        },
        userInfo () {
            return this.$store.state.userInfo
        },
        serviceId () {
            return this.$store.state.serviceId
        }
    },
    mounted () {
        this.checkFullScreen() // 判断是否为安卓全面屏
    },
    methods: {
        goBack () {
            this.$router.go(-1)
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
        },
        goSet () {
            this.$router.push({ path: '/mine/set' })
        }
    }
}
</script>

<style scoped>
    .header-wrap{position:relative;z-index:499;height:.86rem;padding-top:.44rem;background-color:#fff;}
    .header-icon{position:absolute;top:50%;transform:translateY(-50%);margin-top:.22rem;width:.86rem;height:.86rem;background-position:center;background-repeat:no-repeat;}
    .header-icon img{display:block;width:100%;height:100%;}
    .header-back{left:0;background-image:url(/img/common/icon_back.png);background-size:.38rem .36rem;}
    .header-set{right:.15rem;background-image:url(/img/common/icon_set.png);background-size:.38rem .36rem;}
    .header-title{margin:0 1.25rem;height:.86rem;line-height:.86rem;text-align:center;font-size:.32rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .header-title .img{display:inline-block;width:.4rem;height:.4rem;vertical-align:middle;border-radius:100%;margin-right:.1rem;}

    /* iPhone X 全面屏适配 */
    @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
        .header-wrap {
            padding-top: constant(safe-area-inset-top);
            padding-top: env(safe-area-inset-top);
        }
        .header-icon {
            margin-top: calc(constant(safe-area-inset-top) / 2);
            margin-top: calc(env(safe-area-inset-top) / 2);
        }
    }

    /* android 全面屏适配 */
    .header-wrap.android-full-screen{margin-top:.8rem;padding-top:0;}
    .header-wrap.android-full-screen .header-icon{margin-top:0;}
</style>