<template>
    <section class="menu-wrap border-top-line">
        <div class="menu-list">
            <router-link :to="item.url" class="list-item" :class="{ 'current': key === menuConfig.currentIndex }" v-for="(item, key) in menuConfig.item" :key="key" @click="changeMenu(key, item.url)">
                <img class="img" :src="key === menuConfig.currentIndex ? item.iconCurrent : item.icon" />
                <span class="name">{{item.name}}</span>
            </router-link>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Menu',
    props: ['menuConfig']
}
</script>

<style scoped>
    .menu-wrap{position:relative;height:.98rem;z-index:499;background-color:#fff;}
    .menu-list{display:flex;height:.98rem;}
    .menu-list .list-item{flex:1;padding-top:.12rem;color:#ccc;}
    .menu-list .list-item .img{display:block;width:.42rem;height:.42rem;margin:0 auto .1rem auto;}
    .menu-list .list-item .name{display:block;text-align:center;font-size:.22rem;line-height:1;}
    .menu-list .list-item.current{color:#af925d;}
</style>