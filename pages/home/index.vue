<template>
  <section class="home-wrap" v-if="indexData">
      <div class="home-section">
        <div class="banner-wrap">
          <banner-component v-if="indexData.top_banner" class="banner" :data="indexData.top_banner" @callback="clickCallback" />
        </div>
      </div>
      <menu-component :menuConfig="menuConfig" />
  </section>
</template>

<script>
  import BannerComponent from './../../components/common/Banner'
  import MenuComponent from './../../components/common/Menu'

  export default {
    name: 'home',
    head () {
      return {
        title: '首页'
      }
    },
    data () {
      return {
        indexData: null
      }
    },
    computed: {
        menuConfig () {
            return Object.assign({}, this.$store.state.menuConfig, { currentIndex: 0 })
        }
    },
    mounted () {
      this.getIndexData()
    },
    methods: {
      getIndexData () {
        this.$axios.post('/api/platform/online-data').then((res) => {
          let data = res.data
          if (data.code === 0) {
            this.indexData = data.response || {}

            // this.$nextTick(() => {
            //   setTimeout(() => {
            //     window.productExposure.init({
            //       wrapId: 'mescroll',
            //       domClass: '.list-product .list-item',
            //       callback: (value) => {
            //         console.log(value)
            //       }
            //     }) // 监听热门产品曝光信息
            //   }, 100)
            // })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      clickCallback (item, index, name) {
        if (item.jump_type === 2) {
          this.$router.push({ path: `/category/${item.category}` })
        } else {
          if (!item.jump_url) return false
          let targetViewConfig = {
            title: item.title,
            jumpUrl: item.jump_url
          }
          window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
        }
      }
    },
    components: {
      BannerComponent,
      MenuComponent
    }
  }
</script>

<style scoped>
  .home-wrap{display:flex;flex-direction:column;height:100%;}
  .home-section{flex:1;}

  .banner-wrap{height:1.68rem;margin:.2rem .3rem;}
  .banner{position:relative;height:1.68rem;overflow:hidden;}
</style>
