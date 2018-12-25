<template>
    <section v-if="menuConfig.showMenu" class="menu-wrap border-top-line">
        <ul class="menu-list">
            <li class="list-item" :class="{ 'current': key === menuConfig.currentIndex }" v-for="(item, key) in menuConfig.item" :key="key" @click="changeMenu(key, item.url)">
                <img class="img" :src="key === menuConfig.currentIndex ? item.iconCurrent : item.icon" />
                <span class="name">{{item.name}}</span>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'Menu',
    props: ['menuConfig'],
    mounted () {
    },
    methods: {
        changeMenu (key, url) {
            this.$store.commit('menuConfig', {
                currentIndex: key
            })
            this.$router.push(url)
        }
    }
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