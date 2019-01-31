<template>
    <div class="pop-wrap" v-if="showPopAd">
        <div class="pop-cont">
            <img class="img" :src="popAdData.image_url" @click="goTarget" />
            <span class="btn" @click="closeAction"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'popAd',
    props: ['popAdData'],
    data () {
        return {
            showPopAd: false
        }
    },
    mounted () {
        this.showAction() // 判断是否显示弹出广告
    },
    methods: {
        showAction () {
            if (!this.popAdData.image_url) return false

            let popAdDate = window.localStorage.getItem('popAdDate')
            if (!popAdDate || (popAdDate && popAdDate !== new Date().toString().substr(0, 15))) {
                this.showPopAd = true
                this.changeScrollState(true) // 禁止页面滚动
            } else {
                this.showPopAd = false
                this.changeScrollState(false) // 解除禁止页面滚动限制
            }
        },
        changeScrollState (state) {
            let mescroll = document.getElementsByClassName('mescroll')[0]
            if (state) {
                mescroll.classList.add('no-scroll-pop')
            } else {
                mescroll.classList.remove('no-scroll-pop')
            }
        },
        closeAction () {
            this.showPopAd = false
            this.changeScrollState(false) // 解除禁止页面滚动限制
            window.localStorage.setItem('popAdDate', new Date().toString().substr(0, 15))
        },
        goTarget () {
            this.$emit('callback', this.popAdData, 'ads', 'pop-up')
            this.closeAction() // 关闭弹出广告
        }
    }
}
</script>

<style scoped>
    .pop-wrap{position:fixed;top:0;right:0;bottom:0;left:0;z-index:599;background-color:rgba(0, 0, 0, .7);}
    .pop-cont{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:6.4rem;height:6.4rem;}
    .pop-cont .img{display:block;width:100%;height:100%;}
    .pop-cont .btn{position:absolute;bottom:0;left:50%;transform:translateX(-50%) rotate(45deg);width:.75rem;height:.75rem;border:1px solid #fff;border-radius:100%;margin-bottom:-1rem;}
    .pop-cont .btn::before,
    .pop-cont .btn::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background-color:#fff;}
    .pop-cont .btn::before{width:1px;height:80%;}
    .pop-cont .btn::after{width:80%;height:1px;}
</style>