<template>
    <div class="content">
        <h2 class="module-title border-bottom-line" v-if="title">{{title}} <span class="pro-more" @click="goMore">更多</span></h2>
        <ul class="list-product">
            <li v-for="(item, key) in data" class="list-item border-bottom-line" :data-id="item.id" :data-campaignurl="item.campaign_url" :key="key" @click="goTarget(item)">
                <div class="item-icon"><img class="img" :src="item.icon" /></div>
                <h3 class="item-name">{{item.name}}</h3>
                <p class="loan-title">额度{{item.min_loan}}~{{item.max_loan}}元</p>
                <p class="loan-title">{{item.feature_label[0]}}</p>
                <span class="border-right-line" v-if="key%2==0"></span>
            </li>
        </ul>
        <p class="list-more" v-if="title">想看我的底线，请点击更多！</p>
    </div>
</template>

<script>
    export default {
        name: 'HotList',
        props: ['title', 'data'],
        methods: {
            goMore () {
                this.$router.push({ path: '/list' })
            },
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
    .module-title{position: relative; font-size: .3rem;color: #111;font-weight: 700;line-height: 1;    padding: .3rem .3rem .27rem;background-color: #fff;}
    .module-title .pro-more{font-size: .26rem;color: #999;font-weight: normal;position: absolute;right: .32rem;}

    .list-product{ position:relative;background-color:#fff;display: flex;justify-content: space-between;flex-wrap: wrap;}
    .list-product .list-item{width: 50%; position:relative;padding:.3rem 0 .3rem 1.1rem;box-sizing:border-box;}
    .list-product .list-item .item-name{max-width: 2.5rem;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;}
    .list-product .list-item .item-icon{width: .48rem;height: .48rem;position: absolute;left: .3rem;top: 50%;transform: translateY(-50%);}
    .list-product .list-item .loan-title{font-size: .24rem;color: #999;}
    .list-product .list-item .img{display:block;width:100%;height:100%;border-radius:100%;}

    .list-more{line-height:.87rem;text-align:center;font-size:.24rem;color:#ccc;}
</style>