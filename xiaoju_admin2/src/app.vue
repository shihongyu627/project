<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: this.$store.state.app.themeColor,
    }
  },
  created() {
    console.log('app start.')
    // 检测登录状态
    $utils.api
      .load('authCheck', {}, 'post', {
        toast: false,
        toasterror: false,
        loading: false,
        loadingtext: 'Loading',
        login: false,
      })
      .then((res) => {
        if (res.code != 1) {
          // 登录
          $utils.url.push({ name: 'login' })
          return false
        }
        if (res.data && res.data.auths) {
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
        } else {
          $utils.toast.error(res.message)
        }
      })
  },
  mounted() {},
  methods: {},
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.ivu-notice {
  z-index: 9999 !important;
}
</style>
