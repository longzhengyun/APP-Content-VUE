<template>
    <section v-if="headerConfig.showHeader" class="header-wrap" :class="{ 'mine-header': headerConfig.showMineHeader }">
        <div v-if="headerConfig.showBack" class="header-icon header-back" @click="goBack"></div>
        <h2 class="header-title">{{headerConfig.title}}</h2>
    </section>
</template>

<script>
export default {
    name: 'Header',
    props: ['headerConfig'],
    methods: {
        goBack () {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
    .header-wrap{position:relative;z-index:499;height:.86rem;padding-top:.44rem;background-color:#fff;}
    .header-wrap.mine-header{background:#000 url(/img/mine/bg_mine.png) center top no-repeat;background-size:cover;}
    .header-icon{position:absolute;top:50%;transform:translateY(-50%);margin-top:.22rem;}
    .header-icon img{display:block;width:100%;height:100%;}
    .header-back{left:0;width:.86rem;height:.86rem;background:url(/img/common/icon_back.png) center center no-repeat;background-size:.38rem .36rem;}
    .header-title{margin:0 1.25rem;height:.86rem;line-height:.86rem;text-align:center;font-size:.32rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
</style>