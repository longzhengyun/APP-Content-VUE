<template>
    <div class="user-wrap" v-if="data">
        <div class="user-info">
            <div class="user-icon">
                <img class="img" :src="data.avatar ? data.avatar : '/images/common/default_avatar.png'" />
            </div>
            <p class="hello">您好!</p>
            <p class="user-phone">{{data.wxname || hiddenName(data.user_phone)}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'UserInfo',
    props: ['data'],
    methods: {
        hiddenName (name) {
            if (name && name.length === 11) {
                name = name.substr(0, 3) + '***' + name.substr(-4, 4)
            }
            return name
        }
    }
}
</script>
<style scoped>
    .user-wrap{padding:.64rem .3rem .3rem .3rem;background-color:#fff;}
    .user-info{position:relative;padding:.68rem 0 .5rem 0;background: linear-gradient(to right, #BE9F66, #D7BB8C);border-radius:.12rem;text-align:center;color:#fff;}
    .user-icon{position:absolute;left:50%;transform:translateX(-50%);top:-.54rem;width:.96rem;height:.96rem;background-color:#fff;border:.06rem solid #fff;border-radius:100%;overflow:hidden;}
    .user-icon .img{display:block;width:100%;height:100%;border-radius:100%;}
    .user-name{font-size:.26rem;}
    .user-phone{font-size: .34rem;font-weight: 700;margin-top: .25rem;}
</style>