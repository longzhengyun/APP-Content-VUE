<template>
    <ul class="category-list">
        <li class="list-item" v-for="(item, key) in data" :key="key" @click="goTarget(item, key)"><span class="item-icon"><img :src="item.image_url" /></span><p class="item-name">{{item.title}}</p></li>
    </ul>
</template>
<script>
export default {
    name: 'Category',
    props: ['data'],
    methods: {
        goTarget (item, key) {
            this.$emit('callback', item)
        }
    }
}
</script>
<style scoped>
    .category-list{position:relative;display:flex;flex-wrap:wrap;justify-content: space-between;}
    .category-list .list-item{position:relative;margin-bottom:.25rem;text-align:center;}
    .category-list .item-icon{display:inline-block;width:.86rem;height:.86rem;margin-bottom:.05rem;}
    .category-list .item-icon img{display:block;width:100%;height:100%;}
    .category-list .item-name{max-width:6em;margin:0 auto;line-height:.3rem;font-size:.26rem;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
</style>