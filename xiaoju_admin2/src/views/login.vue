<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="../assets/logo.png" class="logo" />
        <p class="slogen">小驹游乐 · 系统管理平台</p>
        <p class="slogen"></p>
      </div>
      <div class>
        <div class="loginBox">
          <div>
            <div class="switchType">
              <img src alt />
              <span class="loginType active">账号登录</span>
              <!-- <span class="switchBorder"></span>  -->
              <!-- <img src="" alt="">  -->
              <!-- <span class="loginType">微信登录</span> -->
            </div>
            <div class="loginCont">
              <Form ref="loginForm" :model="form" :rules="rules">
                <FormItem prop="username">
                  <div class="inputBox hasIcon">
                    <input maxlength="50" v-model="form.username" type="text" placeholder="请输入手机号/帐号" />
                    <Icon type="md-phone-portrait" class="backIcon" />
                  </div>
                </FormItem>
                <FormItem prop="password">
                  <div class="inputBox hasIcon">
                    <input type="password" v-model="form.password" placeholder="请输入密码" />
                    <Icon type="md-lock" class="backIcon" />
                  </div>
                </FormItem>
                <!-- <FormItem prop="code">
                            <img :src="verifyimg" alt="" class="veriImg" @click="reVerifyimg"/> 
                            <div class="inputBox veriCode">
                                <input type="text"  v-model="form.code" placeholder="验证码">
                            </div>
                </FormItem>-->
                <FormItem>
                  <Button size="large" :loading="sloading" @click="handleSubmit" type="primary" long >登录</Button>
                </FormItem>
              </Form>
            </div>
            <p class="bottomTip" v-if="false">© 赏金</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import config from '../../build/config'
export default {
  data() {
    return {
      sloading: false,
      verifyimg: $utils.config.API_HOST + '/admin/api/auth/verifyimg?time=0',
      form: {
        username: '',
        password: '',
        code: 'xxx',
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    reVerifyimg() {
      this.verifyimg = this.verifyimg + 1
    },
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.ajaxLogin(this.form.username, this.form.password, this.form.code)
        }
      })
    },
    ajaxLogin(username, password, code) {
      let q = {}
      q.username = username
      q.password = password
      q.code = code
      q.style = 'all'
      q.scene = 'login'
      this.sloading = true
      $utils.api
        .load('authLogin', q, 'post', {
          toast: false,
          toasterror: false,
          loading: false,
          loadingtext: 'Loading',
          login: false,
        })
        .then((res) => {
          this.sloading = false
          if (res.data) {
            $utils.toast.text(res.message)
            const last_login_time = $utils.time.format(res.data.last_login_time || '')
            $utils.data.set('auth', 'last_login_time', last_login_time)
            $utils.data.set('auth', 'auths', [])
            $utils.data.set('auth', 'username', res.data.username)
            $utils.data.set('auth', 'suid', res.data.suid)
            $utils.data.set('auth', 'uid', res.data.uid)
            $utils.data.set('auth', 'uname', res.data.uname)
            $utils.data.set('auth', 'avatar', $utils.image.load(res.data.head) || require('@/assets/img/useravatar.jpg'))
            $utils.data.set('auth', 'auths', res.data.auths)
            $utils.data.set('auth', 'is_system', res.data.is_admin)
            $utils.data.set('auth', 'is_admin', res.data.is_admin)
            $utils.data.set('auth', 'is_all_order', res.data.is_all_order)
            $utils.data.set('auth', 'shop_id', res.data.shop_id)
            $utils.data.set('auth', 'shop_name', res.data.shop_name)
            // 强制刷新页面 否则左侧路由无法更新
            this.$store.commit('updateMenulist')
            $utils.url.push({ path: '/index' })
            window.location.reload(true)
          } else {
            this.reVerifyimg()
            $utils.toast.error(res.message)
          }
        })
        .catch((err) => {
          this.sloading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-image: url('../assets/img/login_bg.png');
  // background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  position: relative;
  // background-color: #f0f2f5;
  &-infor {
    height: 135px;
    width: 240px;
    margin: 0 auto;
    .made-child-con-middle {
      height: 100%;
    }
  }
  &-logo {
    display: block;
    width: 90%;
    max-width: 100px;
    height: auto;
  }
  &-title {
    font-size: 2em;
    color: #2d8cf0;
  }
  &-stitle {
    font-size: 1.2em;
  }
  &-con {
    position: relative;
    // right: 160px;
    top: 45%;
    transform: translateY(-60%);
    width: 368px;
    margin: 0 auto;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}

.logoArea {
  // position: absolute;
  width: 100%;
  margin-top: -60px;
  // top: 6%;
  text-align: center;
  // left: 0
}

.logo {
  width: 120px;
  height: 120px;
  cursor: pointer;
}

.loginContainer {
  // position: absolute;
  min-height: 320px;
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.xiaoeDesc {
  width: 285px;
  line-height: 20px;
  font-family: PingFangSC;
  font-size: 14px;
  letter-spacing: -0.2px;
  text-align: center;
  color: #b2b2b2;
  position: absolute;
  bottom: 30px;
  left: 50%;
  margin-left: -142px;
}

.xiaoeDesc:after,
.xiaoeDesc:before {
  content: '';
  position: absolute;
  border-bottom: 2px solid #bbb;
  width: 30px;
  top: 9px;
  right: 0;
}

.xiaoeDesc:before {
  right: auto;
  left: 0;
}

.veriImg {
  float: right;
  width: 100px;
  height: 36px;
  border: 1px solid #eee;
}
.slogen {
  font-size: 24px;
  line-height: 1.25;
  text-align: center;
  color: #666;
  font-family: microsoft yahei;
  margin-top: 15px;
  font-weight: bold;
}

.loginBox {
  width: 400px;
  background-color: #fff;
  padding: 40px 50px;
  border: 1px solid #efefef;
  border-radius: 10px;
}

.switchType {
  text-align: center;
  height: 22px;
  line-height: 22px;
}

.switchType img {
  height: 18px;
  width: auto;
  vertical-align: middle;
  cursor: pointer;
}

.switchType .loginType {
  font-size: 16px;
  color: #b2b2b2;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}

.switchType .loginType.active {
  color: #353535;
}

.switchType .switchBorder {
  width: 2px;
  height: 18px;
  background-color: #d8d8d8;
  margin: 0 16px;
  display: inline-block;
  vertical-align: middle;
}

.loginCont {
  padding: 32px 0 0;
}

.bottomTip {
  font-size: 12px;
  color: #353535;
  text-align: center;
  margin: 0;
  margin-top: 30px;
}

.veriCode {
  width: 180px;
}

.veriImg {
  float: right;
  width: 100px;
  height: 36px;
}

.loginOperate {
  font-size: 12px;
  line-height: 14px;
}

.loginOperate label {
  line-height: 14px;
  height: 14px;
  font-size: 12px;
  color: #b2b2b2;
}

.loginOperate a {
  color: #b2b2b2;
}

.loginOperate a:hover {
  color: #2a75ed;
}

.wxLogin {
  text-align: center;
}

.wxLogin #login_container {
  width: 200px;
  height: 200px;
  display: block;
  margin: 0 auto;
}

.wxLogin .wxTip {
  margin: 0;
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: #353535;
}

.wxLogin .wxAlert {
  font-size: 12px;
  text-align: center;
  color: #fb6161;
  margin-top: 10px;
  margin-bottom: 0;
  display: none;
}

.wxLogin .wxAlert.active {
  display: block;
}

.wxLoginFaild {
  text-align: center;
}

.wxLoginFaild img {
  width: 60px;
  margin-top: 60px;
  height: 60px;
}

.wxLoginFaild .title {
  font-size: 16px;
  color: #353535;
  margin: 20px 0 10px;
  font-weight: 700;
}

.wxLoginFaild .cont {
  font-size: 14px;
  margin: 0;
}

.wxLoginFaild button {
  margin-top: 77px;
}

div.inputBox {
  height: 36px;
  position: relative;
}

div.inputBox:focus {
  border: 1px solid #000;
}

div.inputBox.hasIcon {
  background-size: 12px auto;
  background-position: left 10px center;
  background-repeat: no-repeat;
}

div.inputBox.hasIcon input {
  text-indent: 38px;
}

div.inputBox .backIcon {
  position: absolute;
  font-size: 20px;
  width: 22px;
  left: 10px;
  top: 6px;
  color: #888;
}

div.inputBox input {
  font-size: 14px;
  border: none;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  width: 100%;
  line-height: 34px;
  height: 36px;
  display: block;
  text-indent: 10px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 2px;
  border: 1px solid #eee;
  background: transparent;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}

div.inputBox input:focus {
  border: 1px solid #2a75ed;
}

div.inputBox.alert input {
  border-color: #fb6161;
}

div.inputBox.alert + .inputAlert {
  display: block;
  color: #fb6161;
  font-size: 12px;
  margin: 0;
  line-height: 12px;
  margin-top: -22px;
  margin-bottom: 10px;
  position: absolute;
}

div.inputBox.alert + .inputAlert.hasTitle {
  margin-left: 66px;
}

div.inputBox + .inputAlert {
  display: none;
}

a {
  text-decoration: none;
  color: #2a75ed;
  font-size: 12px;
}

button.btn {
  width: 100%;
  height: 36px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 36px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button.btn.blue {
  color: #fff;
  background-color: #2a75ed;
}

button.btn.grey {
  background-color: #f5f7fa;
  border: 1px solid #e5e7ea;
  color: #666;
}

button.btn.opacity {
  opacity: 0.3;
  outline: none;
}
</style>
