<template>
    <ul class="list-product">
        <li v-for="(item, key) in data" class="list-item border-bottom-line" :data-id="item.id" :data-campaignurl="item.campaign_url" :key="key" @click="goTarget(item)">
            <div class="item-icon"><img class="img" :src="item.icon" /></div>
            <h3 class="item-name">{{item.name}}</h3>
            <div class="item-loan">
                <div class="loan-mon">
                    <p class="loan-title">额度范围(元)</p>
                    <p class="loan-num">{{item.min_loan}}~{{item.max_loan}}</p>
                </div>
                <div class="loan-rate">
                    <p class="loan-title">日利率</p>
                    <p class="loan-num">{{item.day_rate}}％</p>
                </div>
            </div>
            <ul class="item-tip ellips">
                <li class="tip-item" v-for="(tipItem, tipKey) in item.feature_label" :key="tipKey" >{{tipItem}}</li>
            </ul>
            <div class="item-right">
                <div class="item-progress" v-if="item.order_percent>0&&item.order_percent<100">
                    <h3 class="progress-title">已完成{{item.order_percent}}%</h3>
                    <div class="progress-con"><span class="progress-finish" :style="{width:item.order_percent+'%'}"></span></div>
                </div>
                <p class="item-btn">立即申请</p>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'ListProduct',
        props: ['data'],
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
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
    .list-product{position:relative;background-color:#fff;}
    .list-product .list-item{position:relative;padding:.3rem .3rem .3rem 1.1rem;box-sizing:border-box;}
    .list-product .list-item:last-child{margin-bottom:0;}
    .list-product .list-item:last-child::after{content:initial;}
    .list-product .item-icon{position: absolute;left: .3rem;top: .3rem;width: .6rem;height: .6rem;}
    .list-product .item-icon .img{display:block;width:100%;height:100%;border-radius:100%;}
    .list-product .item-loan{display: flex;justify-content: space-between;margin-bottom: .08rem;max-width: 3.2rem;margin-bottom: .08rem;}
    .list-product .item-loan .loan-title{font-size: .24rem;color: #999;}
    .list-product .item-loan .loan-num{font-size: .3rem;color: #C1A36B;font-weight: 700;}
    .list-product .item-limit{line-height:1;font-size:.3rem;color:#111;font-weight:700;text-align: center;}
    .list-product .item-name{margin-right:1.6rem;font-size:.28rem;color:#333;font-weight:700; white-space:nowrap;text-overflow:ellipsis;overflow:hidden;vertical-align:middle;}
    .list-product .item-tip{font-size:.18rem;text-align: center;color:#C1A36B;display: flex;justify-content: flex-start;}
    .list-product .item-tip .tip-item{padding: .05rem .1rem;background-color: #F2F2F2;border-radius: .04rem;margin-right: .2rem;}

    .list-product .item-right{position: absolute;top: .25rem;right: .3rem;}
    .list-product .item-right .progress-title{font-size: .24rem;color: #C1A36B;text-align: center;}
    .list-product .item-right .progress-con{height: .08rem;background-color: #DFDFDF;margin-bottom: .2rem;}
    .item-right .progress-con .progress-finish{display: block; width: 50%;height: 100%; background-color: #C1A36B;}

    .list-product .item-btn{width: 1.42rem;height: .54rem;border: .01rem solid #C1A36B;font-size: .26rem;color: #C1A36B;text-align: center;font-weight: 700;padding-top: .07rem;box-sizing: border-box;}
</style>