<template>
    <section class="section-wrap">
        <div class="mescroll"></div>
        <menu-component :menuConfig="menuConfig" />
    </section>
</template>

<script>
    import MenuComponent from './../../components/common/Menu'

    export default {
        name: 'mine',
        head () {
            return {
                title: '我的'
            }
        },
        data () {
            return {}
        },
        computed: {
            menuConfig () {
                return Object.assign({}, this.$store.state.menuConfig, { currentIndex: 2 })
            }
        },
        mounted () {},
        methods: {},
        components: {
            MenuComponent
        }
    }
</script>

<style scoped>
</style>