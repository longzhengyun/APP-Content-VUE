<template>
    <div class="product-con" :data-id="data.id" :data-campaignurl="data.campaign_url">
        <h2 class="con-title">{{data.name}}</h2>
        <ul class="describe-menu">
            <li class="describe-item"  v-for="(item, key) in data.feature_label" :key="key">{{item}}</li>
        </ul>
        <div class="limmit-money">{{data.min_loan}}~{{data.max_loan}}</div>
        <div class="pro-btn" @click="goTarget(data)">立即借钱</div>
    </div>
</template>

<script>
    export default {
        name: 'ProductItem',
        props: ['data'],
        methods: {
            goTarget (item) {
                if (item.is_third_call === 0) {
                    this.goTargetView(item)
                } else {
                    this.$router.push({ path: `/product/${item.id}` })
                }
            },
            goTargetView (item) {
                if (!item.campaign_url) return false
                let targetViewConfig = {
                    title: item.name,
                    jumpUrl: item.campaign_url
                }
                window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
            }
        }
    }
</script>

<style scoped>
    .product-con{text-align: center;background-color: #fff;padding: .23rem 0 .35rem;}
    .product-con .describe-menu{display:flex;justify-content: center;font-size: .24rem;color: #999;margin-top: .1rem;}
    .product-con .describe-menu .describe-item{position: relative;padding: 0 .3rem;}
    .product-con .describe-menu .describe-item::before{content: '·';position: absolute;width: .1rem;height: .1rem;border-radius: 50%;background-color: #ccc;top: 50%;left: .07rem;transform: translateY(-50%);color:transparent;}
    .product-con .limit-toitle{font-size: .24rem;color: #999;}
    .product-con .limmit-money{font-size: .6rem;color: #C1A36B;font-weight: 700;}
    .product-con .pro-btn{margin:0 .4rem;height:.94rem;background:linear-gradient(to right, #BE9F66, #D7BB8C);border-radius: .12rem; line-height: .94rem; font-size: .34rem;color: #fff;font-weight: 700;}
</style>