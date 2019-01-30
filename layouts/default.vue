<template>
  <div class="app-wrap" ref="appWrap">
    <header-component :headerConfig="curHeaderConfig" />
    <nuxt />
    <menu-component :menuConfig="curMenuConfig" />
  </div>
</template>

<script>
  import { swVersion } from './../package'
  import { setHeaderConfigAction, setMenuConfigAction } from './../assets/js/setAppConfig'

  import HeaderComponent from './../components/common/Header'
  import MenuComponent from './../components/common/Menu'

  export default {
    data () {
      return {
        curHeaderConfig: {},
        curMenuConfig: {}
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      },
      headerConfig () {
        return this.$store.state.headerConfig
      },
      menuConfig () {
        return this.$store.state.menuConfig
      }
    },
    mounted () {
      this.setHeaderConfig(this.$route) // 设置header属性
      this.getUserInfo() // 获取用户登录信息
      this.addPWA() // 添加service worker
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function (val, oldVal) {
        if (val.name !== 'index' && oldVal.name === 'index' && !this.userInfo) {
          this.$router.replace({ path: '/' })
        }

        this.setHeaderConfig(val) // 设置header

        if (this.userInfo) { // 需要登录才显示menu
          this.setMenuConfig(val)
        }
      }
    },
    methods: {
      addPWA () {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault() // 阻止默认安装事件
          return false
        })

        // 注册serviceWorker
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
          navigator.serviceWorker.register('/serviceWorker.js').then((registration) => { // 注意SW文件的相对路径 ./ 和绝对路径 / 的区别
            if (localStorage.getItem('swVersion') !== swVersion) { // 解决因为服务器缓存serviceWorker.js导致的serviceWorker不更新问题
              registration.update().then(() => {
                localStorage.setItem('swVersion', swVersion)
              })
            }
            console.log('ServiceWorker registration successful with scope: ', registration.scope) // 注册成功
          }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err) // 注册失败
          })
        }
      },
      setConfig () {
        // 设置header menu属性
        this.setHeaderConfig(this.$route)
        this.setMenuConfig(this.$route)
      },
      setHeaderConfig (value) {
        let config = setHeaderConfigAction(value.name) // 执行配置头部方法

        this.curHeaderConfig = Object.assign({}, this.headerConfig, config) // 将新值和默认值合并到空对象中 解决直接修改子属性组件不更新问题

        this.RNPostMessage(() => {
          window.postMessage(JSON.stringify({
            route: value.name
          }), '*') // 向客户端发送当前头部配置
        })
      },
      setMenuConfig (value) {
        let config = setMenuConfigAction(value.name) // 执行配置菜单方法

        let menuConfig = this.menuConfig

        this.curMenuConfig = Object.assign({}, menuConfig, config) // 将新值和默认值合并到空对象中 解决直接修改子属性组件不更新问题
      },
      getUserInfo () {
        // 未登录跳转登录页
        if (this.$route.name !== 'index' &&
          this.$route.name.indexOf('activities') !== 0 &&
          !this.userInfo) {
          this.$axios.post('/api/user/info').then((res) => {
            let data = res.data
            if (data.code === 0) {
              this.$store.commit('userInfo', data.response)
              this.setConfig() // 设置header menu信息
            } else {
              this.$router.push({ path: '/', query: { redirect: this.$route.fullPath } }) // 未登录，跳转登录页
            }
          })
        }
      },
      RNPostMessage (init) {
        const whenRNPostMessageReady = (cb) => { // 监听RN postMessage初始化是否完成
          if (window && window.postMessage.length > 0) cb()
          else window.setTimeout(function () { whenRNPostMessageReady(cb) }, 1000)
        }

        whenRNPostMessageReady(init)
      }
    },
    components: {
      HeaderComponent,
      MenuComponent
    }
  }
</script>
