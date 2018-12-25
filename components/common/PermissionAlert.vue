
<template>
    <div class="permission-alert">
        <div class="alert-wrap">
            <h3 class="alert-title">{{data.title}}</h3>
            <p class="alert-cont">{{data.text}}</p>
            <div class="alert-action" @click="goBack">返回</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PermissionAlert',
    props: ['data'],
    methods: {
        goBack () {
            this.$router.back()
        }
    }
}
</script>
<style scoped>
    .permission-alert{position:fixed;top:0;right:0;bottom:0;left:0;z-index:499;background-color:rgba(0, 0, 0, .7);}
    .alert-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background-color:#fff;border-radius:.12rem;padding:.3rem;}
    .alert-wrap .alert-title{text-align:center;}
    .alert-wrap .alert-cont{margin:.2rem 0;color:#999;}
    .alert-wrap .alert-action{border-radius:.64rem;text-align:center;line-height:.64rem;font-size:.24rem;color:#fff;background:linear-gradient(left, rgb(190,159,102), rgb(215,187,140));}
</style>