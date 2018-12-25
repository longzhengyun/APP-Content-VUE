
<template>
    <div class="update-alert">
        <div class="alert-wrap">
            <h3 class="alert-title">{{data.title}}</h3>
            <p class="alert-cont">{{data.text}}</p>
            <ul class="alert-action">
                <li class="action-item update-item" @click="update">升级</li>
                <li class="action-item" @click="skip" v-if="data.upgrade === '1'">跳过</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'UpdateAlert',
    props: ['data'],
    methods: {
        skip () {
            window.localStorage.setItem('updateSkip', this.data.version)
            this.$emit('hideAlert')
        },
        update () {
            let targetViewConfig = {
                title: '贝壳多多',
                jumpUrl: window.location.origin + '/activities/download'
            }
            window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
        },
        setCookie (key, value, time) {
            let date = new Date() // 获取当前时间
            let expiresDays = time // 将date设置为n天以后的时间
            date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000) // 格式化为cookie识别的时间
            document.cookie = key + '=' + value + ';expires=' + date.toGMTString() + ';path=/' // 设置cookie
        }
    }
}
</script>
<style scoped>
    .update-alert{position:fixed;top:0;right:0;bottom:0;left:0;z-index:499;background-color:rgba(0, 0, 0, .7);}
    .alert-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background-color:#fff;border-radius:.12rem;padding:.3rem;}
    .alert-wrap .alert-title{text-align:center;}
    .alert-wrap .alert-cont{margin:.2rem 0;color:#999;text-align:justify;}
    .alert-wrap .alert-action{display:flex;}
    .alert-wrap .alert-action .action-item{flex:1;border-radius:.64rem;text-align:center;line-height:.64rem;font-size:.24rem;color:#999;border:1px solid #eee;margin-left:.25rem;}
    .alert-wrap .alert-action .update-item{margin-left:0;color:#fff;background:linear-gradient(left, rgb(190,159,102), rgb(215,187,140));border:0;}
</style>