<template>
    <section class="container">
        <div class="fail">
            <img src="/img/common/default_fail.png" class="fail-icon" />
            <span class="fail-text">加载失败，请检查网络</span>
            <nuxt-link class="button" to="/" v-if="error.statusCode === 404">返回首页</nuxt-link>
        </div>
    </section>
</template>
<script>
export default {
    props: ['error'],
    mounted () {
        console.log(this.error.statusCode + ':' + this.error.message)
    }
}
</script>

<style scoped>
    .container{flex:1;}
    .fail{position:absolute;top:40%;left:50%;transform:translate(-50%, -50%);text-align:center;}
    .fail .fail-icon{display:block;width:4.2rem;height:2.92rem;margin:0 auto;}
    .fail .fail-text{display:block;font-size:.26rem;margin-top:.3rem;color:#999;white-space:nowrap;}
    .button{display:inline-block;margin:.3rem auto 0 auto;padding:.05rem .4rem;font-size:.3rem;border-radius:.7rem;line-height:1.7;background: linear-gradient(to right, rgb(190,159,102), rgb(215,187,140));color:#fff;}
</style>
