<template>
  <section class="container" v-if="showLogin">
    <div class="form-cont">
      <div class="user-icon"><img class="img" src="/img/login/icon_login.png" alt="" /></div>
      <div class="form-mode">
          <div class="mode-item">
              <label class="item-value"><input class="item-input" type="tel" placeholder="请输入手机号" maxlength="11" v-model="formData.phone" /></label>
          </div>
          <div class="mode-item">
              <label class="item-value"><input class="item-input" type="tel" placeholder="请输入验证码" maxlength="4" v-model="formData.code" /></label>
              <span class="btn-code" :class="{'disable': !getCodeState}" @click="getCode">{{checkCodeText}}</span>
          </div>
      </div>
      <div class="form-submit">
          <span class="btn-submit" :class="{ 'disable': !submitState }" @click="submitData">登录</span>
      </div>
    </div>
    <p class="agreement">
      <label>
        <input type="checkbox" class="checkbox" checked="checked" @click="changeCheckboxState" /> 登录/注册即表示同意
      </label>
      <span class="color" @click="goTargetView">《服务协议》</span>
    </p>
  </section>
</template>

<script>
  export default {
    name: 'login',
    head () {
      return {
        title: '登录'
      }
    },
    data () {
      return {
        showLogin: false,
        phoneState: false,
        codeState: false,
        getCodeState: false,
        submitState: false,
        checkCodeText: '获取验证码',
        formData: {
          phone: '',
          code: ''
        },
        timer: null,
        contractsCheckbox: true
      }
    },
    watch: {
      formData: {
        handler: function (val, oldVal) {
          this.formValidation()
        },
        deep: true
      },
      contractsCheckbox: 'formValidation'
    },
    mounted () {
      // 验证是否登录
      this.getUserInfo()
    },
    methods: {
      getUuid () {
        let ua = window.navigator.userAgent
        if (ua) {
          let uaArray = ua.split(' ')
          uaArray.map((value) => {
            if (value.indexOf('DeviceID') >= 0) {
              this.getToken(value.slice(9)) // 获取token
            }
          })
        }
      },
      getToken (uuid) {
        // 获取token
        this.$axios.post('/api/auth/token', { uuid })
      },
      formValidation () {
        let phoneReg = /^1[3-9][0-9]{9}$/
        if (this.formData.phone && this.formData.phone.length === 11 && phoneReg.test(this.formData.phone)) {
          this.phoneState = true
          this.getCodeState = true
        } else {
          this.phoneState = false
          this.getCodeState = false
        }
        if (this.formData.code && this.formData.code.length === 4) {
          this.codeState = true
        } else {
          this.codeState = false
        }
        if (this.phoneState && this.codeState && this.contractsCheckbox) {
          this.submitState = true
        } else {
          this.submitState = false
        }
      },
      getCode () {
        if (this.getCodeState) {
          this.$axios.post('/api/auth/code', { phone: this.formData.phone }).then((res) => {
            let data = res.data
            this.$toast.show(data.message)
            if (data.code === 0) {
              this.countDown() // 倒计时
            }
          })
        }
      },
      countDown () {
        let defaultText = this.checkCodeText
        let count = 60
        this.getCodeState = false
        this.checkCodeText = count + 's'
        this.timer = setInterval(() => {
          this.getCodeState = false
          if (count <= 1) {
            clearInterval(this.timer)
            this.checkCodeText = defaultText
            this.getCodeState = true
          } else {
            count--
            this.checkCodeText = count + 's'
          }
        }, 1000)
      },
      submitData () {
        if (this.submitState) {
          this.submitState = false // 禁止连续点击
          this.$axios.post('/api/auth/login', this.formData).then((res) => {
            let data = res.data
            this.$toast.show(data.message)
            if (data.code === 0) {
              this.getUserInfo()
            } else {
              this.submitState = true // 登录失败，允许重试
            }
          })
        }
      },
      getUserInfo () {
        this.$axios.post('/api/user/info').then((res) => {
          let data = res.data
          if (data.code === 0) {
              this.$store.commit('userInfo', data.response)
              let path = this.$route.query.redirect ? this.$route.query.redirect : '/home'
              this.$router.replace({ path })
          } else {
            this.showLogin = true
            this.getUuid() // 获取设备id
          }
        })
      },
      changeCheckboxState (e) {
        this.contractsCheckbox = e.target.checked
      },
      goTargetView () {
        let targetViewConfig = {
          title: '服务协议',
          jumpUrl: `${location.origin}/activities/agreement`
        }
        window.postMessage(JSON.stringify({ targetViewConfig }), '*') // 向客户端发送第三方页面配置数据
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
      this.timer = null
    }
  }
</script>

<style scoped>
  .container{display:flex;flex-direction:column;flex:1;}
  .form-cont{flex:1;min-height:7rem;}

  .user-icon{margin:1.14rem auto .6rem auto;width:1.52rem;height:1.52rem;border-radius:100%;overflow:hidden;}
  .user-icon .img{display:block;width:100%;height:100%;}

  .form-mode{margin-bottom:.2rem;padding:0 .3rem;}
  .form-mode .mode-item{position:relative;margin-bottom:.2rem;border-radius:.52rem;border:1px solid #e1e1e1;}
  .form-mode .mode-item .item-value{position:relative;z-index:5;display:block;height:.52rem;padding:.2rem 0;font-size:.28rem;}
  .form-mode .mode-item .item-input{display:block;width:100%;height:100%;text-indent:.3rem;}
  .form-mode .mode-item .item-input::-webkit-input-placeholder{color:#ccc;}
  .form-mode .mode-item .btn-code{position:absolute;right:.3rem;top:50%;z-index:9;transform:translateY(-50%);color:#666;}
  .form-mode .mode-item .btn-code.disable{color:#cbcbcb;}

  .form-submit{padding:.4rem .3rem;}
  .form-submit .btn-submit{display:block;height:.94rem;line-height:.94rem;text-align:center;border-radius:.94rem;background:linear-gradient(to right, rgb(190,159,102), rgb(215,187,140));color:#fff;font-size:.34rem;}
  .form-submit .btn-submit.disable{opacity:.7;}

  .agreement{padding:.25rem 0 .5rem 0;font-size:.24rem;color:#999;padding-left:.65rem;text-align:center;}
  .agreement .color{color:#c1a36b;}
  .agreement .checkbox{position:relative;display:inline-block;width:.24rem;height:.24rem;border:1px solid #c1a36b;vertical-align:middle;}
  .agreement .checkbox:checked::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%, -80%) rotate(-45deg);width:.16rem;height:.08rem;border:1px solid;border-color:transparent transparent #c1a36b #c1a36b;}
</style>