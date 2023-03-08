<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <div class="sidebar-menu-con" :style="{ background: menuTheme == 'light' ? '#fff' : '#303954', width: shrink ? '60px' : '180px', overflow: shrink ? 'visible' : 'auto', 'box-shadow': 'none' }">
      <scroll-bar ref="scrollBar">
        <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
          <div slot="top" class="logo-con">
            <img v-show="!shrink" src="../assets/logo.png" key="max-logo" />
            <img v-show="shrink" src="../assets/logo.min.png" key="min-logo" />
          </div>
        </shrinkable-menu>
      </scroll-bar>
    </div>
    <div class="main-header-con" :style="{ paddingLeft: shrink ? '60px' : '180px', height: 'auto', 'box-shadow': 'none' }">
      <div class="main-header" style="box-shadow:none">
        <div class="navicon-con">
          <Button :style="{ transform: 'rotateZ(' + (this.shrink ? '-180' : '0') + 'deg)' }" type="text" @click="toggleClick">
            <Icon type="md-options" size="24" style="margin-top:2px;"></Icon>
            <!-- <Icon type="navicon" size="30"></Icon> -->
          </Button>
        </div>
        <div class="navicon-con">
          <Button type="text" @click="backClick">
            <Icon type="md-arrow-round-back" size="24" style="margin-top:2px;color:#666;"></Icon>
            <!-- <Icon type="ios-arrow-thin-left" size="30"></Icon> -->
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <!-- <div class="header-middle-con" style="float:right;">
              <div class="main-breadcrumb" style="margin-top:0px;">
                  <h3>{{shopName}}</h3>
              </div>
          </div> -->
          <!-- <btn-home></btn-home> -->
          <!-- <lock-screen></lock-screen> -->
          <!-- <message-tip v-model="mesCount"></message-tip> -->
          <!-- <theme-switch></theme-switch> -->

          <div class="user-dropdown-menu-con" style="right:15px;">
            <full-screen v-model="isFullScreen" style="float:left;margin-right:10px;" @on-change="fullscreenChange"></full-screen>
            <Row type="flex" justify="start" align="middle" class="user-dropdown-innercon" style="padding-right:0px;">
              <Dropdown transfer trigger="hover" transfer-class-name="dropdown-class" @on-click="handleClickUserDropdown" >
                <a href="javascript:void(0)">
                  <span class="main-user-name" v-if="shopName">{{ shopName }}</span>
                  <span class="main-user-name" v-if="!shopName">{{ userName }}</span>
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <template v-if="!isSystem">
                    <DropdownItem v-for="(item, index) in shopDrop" :key="index" :name="item.value">
                      <Badge :color="item.value == shopId?'blue':'#fff'" :text="item.name" />
                    </DropdownItem>
                  </template>
                  <DropdownItem name="password" divided>修改密码</DropdownItem>
                  <DropdownItem name="clearcache">清理缓存</DropdownItem>
                  <DropdownItem name="logout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="avatorPath" style="background: #fff;margin-left: 10px;width:40px;height:40px;line-height:40px;border-radius:20px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <!-- <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>-->
    </div>
    <div id="box-body" class="single-page-con" :style="{ left: shrink ? '60px' : '180px', top: '70px' }">
      <div class="single-page">
        <Card dis-hover shadow style="position: relative;box-shadow: none;">
          <Spin fix v-if="cardLoading">
            <Icon type="ios-loading" size="18" class="card-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
          <router-view></router-view>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import * as mainComponents from './components/main'
import Cookies from 'js-cookie'

export default {
  components: mainComponents,
  data() {
    return {
      shrink: false,
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      shopDrop: [],
    }
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList
    },
    // pageTagsList () {
    //     return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    // },
    currentPath() {
      return this.$store.state.app.currentPath // 当前面包屑数组
    },
    avatorPath() {
      return $utils.data.get('auth', 'avatar')
    },
    cachePage() {
      return this.$store.state.app.cachePage
    },
    lang() {
      return this.$store.state.app.lang
    },
    menuTheme() {
      return this.$store.state.app.menuTheme
    },
    mesCount() {
      return this.$store.state.app.messageCount
    },
    cardLoading() {
      return this.$store.state.app.cardLoading
    },
    isSystem() {
      return $utils.data.get('auth', 'is_system') || false
    },
    userName() {
      return $utils.data.get('auth', 'uname') || ''
    },
    shopId() {
      return this.$store.state.app.shopId || $utils.data.get('app', 'shopId') || ''
    },
    shopName() {
      return this.$store.state.app.shopName || $utils.data.get('app', 'shopName') || ''
    },
  },
  methods: {
    init() {
      let pathArr = $utils.view.setCurrentPath(this, this.$route.name)
      this.$store.commit('updateMenulist')
      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      let messageCount = 3
      this.messageCount = messageCount.toString()
      this.$store.commit('setMessageCount', 3)
    },
    toggleClick() {
      this.shrink = !this.shrink
    },
    backClick() {
      $utils.url.go(-1)
    },
    handleClickUserDropdown(name) {
      if (name === 'password') {
        this.$router.push({
          name: 'user_up_password',
        })
      } else if (name === 'logout') {
        // 退出登录
        $utils.api.load('authLogout').then((res) => {
          $utils.data.set('auth', 'auths', [])
          window.localStorage.setItem('token', '')
          $utils.data.clear('auth')
          $utils.data.clear('storage')
          this.$store.commit('logout', this)
          this.$router.push({
            name: 'login',
          })
        })
      } else if (name === 'clearcache') {
        // 清理缓存
        $utils.api.load('siteClearCache').then((res) => {
          $utils.toast.text(res.message)
        })
      } else {
        // 切换商家
        this.handleClickShopDropdown(name)
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      return true
    },
    fullscreenChange(isFullScreen) {
      console.log(isFullScreen)
    },
    scrollBarResize() {
      this.$refs.scrollBar && this.$refs.scrollBar.resize && this.$refs.scrollBar.resize()
    },
    async loadShopDrop() {
      let q = {}
      let res = await $utils.api.load('shopDropList', q, 'get', {
        toast: false,
        toasterror: false,
        loading: false,
        loadingtext: 'Loading',
        login: false,
      })
      if (res) {
        if (res && res.data) {
          this.shopDrop = res.data || []
          console.log('dropList shopDrop', this.shopDrop)
          // 获取本地缓存的商家id
          let c_id = $utils.data.get('app', 'shopId')
          let c_name = $utils.data.get('app', 'shopName')
          if (c_id) {
            let isHave = false
            for (let index = 0; index < this.shopDrop.length; index++) {
              const element = this.shopDrop[index]
              if (element.value == c_id) {
                isHave = true
                c_name = element.name
              }
            }
            // 不存在已缓存的商家id,则清理掉缓存id
            if (!isHave) {
              c_id = 0
            }
          }
          if (!c_id) {
            c_id = this.shopDrop[0] && this.shopDrop[0].value
            c_name = this.shopDrop[0] && this.shopDrop[0].name
          }
          // 设置当前商家
          console.log('设置商家', c_id, c_name)
          $utils.data.set('app', 'shopId', c_id)
          $utils.data.set('app', 'shopName', c_name)
          this.$store.commit('setShop', { shopId: c_id, shopName: c_name })
        }
      }
    },
    handleClickShopDropdown(name) {
      // 切换小区
      let c_id = name
      let c_name = ''
      for (let index = 0; index < this.shopDrop.length; index++) {
        const element = this.shopDrop[index]
        if (element.value == c_id) {
          c_name = element.name
        }
      }
      if(c_name){
        console.log('switch shop ', c_id, c_name)
        $utils.data.set('app', 'shopId', c_id)
        $utils.data.set('app', 'shopName', c_name)
        this.$store.commit('setShop', { shopId: c_id, shopName: c_name })
        window.location.reload(true)
      }
    },
  },
  watch: {
    $route(to) {
      this.$store.commit('setCurrentPageName', to.name)
      let pathArr = $utils.view.setCurrentPath(this, to.name)
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      localStorage.currentPageName = to.name
    },
    lang() {
      $utils.view.setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize()
      }, 300)
    },
  },
  mounted() {
    this.init()
    window.addEventListener('resize', this.scrollBarResize)
  },
  async created() {
    await this.loadShopDrop()
    // 显示打开的页面的列表
    // this.$store.commit('setOpenedList');
  },
  dispatch() {
    window.removeEventListener('resize', this.scrollBarResize)
  },
}
</script>
<style lang="less">
.lock-screen-back {
  border-radius: 50%;
  z-index: -1;
  box-shadow: 0 0 0 0 #667aa6 inset;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 3s;
}
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  .unlock-con {
    width: 0px;
    height: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 11000;
  }
  .sidebar-menu-con {
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 21;
    transition: width 0.3s;
  }
  .layout-text {
    display: inline-block;
    white-space: nowrap;
    position: absolute;
  }
  .main-hide-text .layout-text {
    display: none;
  }
  &-content-container {
    position: relative;
  }
  &-header-con {
    box-sizing: border-box;
    position: fixed;
    display: block;
    padding-left: 200px;
    width: 100%;
    height: 100px;
    z-index: 20;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    transition: padding 0.3s;
  }
  &-breadcrumb {
    padding: 8px 15px 0;
  }
  &-menu-left {
    background: #464c5b;
    height: 100%;
  }
  .tags-con {
    height: 40px;
    z-index: -1;
    overflow: hidden;
    background: #f0f0f0;
    .tags-outer-scroll-con {
      position: relative;
      box-sizing: border-box;
      padding-right: 120px;
      width: 100%;
      height: 100%;
      .tags-inner-scroll-body {
        position: absolute;
        padding: 2px 10px;
        overflow: visible;
        white-space: nowrap;
        transition: left 0.3s ease;
      }
      .close-all-tag-con {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 8px;
        text-align: center;
        width: 110px;
        height: 100%;
        background: white;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
      }
    }
  }
  &-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    box-shadow: none;
    display: flex;
    align-items: center;
    z-index: 11;
    .navicon-con {
      display: inline-block;
    }
    .header-middle-con {
      overflow: hidden;
      .main-breadcrumb {
        padding: 0;
      }
    }
    .header-avator-con {
      // height: 100%;
      width: 380px;
      float: right;
      .switch-theme-con {
        display: inline-block;
        width: 40px;
        height: 100%;
      }
      .message-con {
        display: inline-block;
        width: 30px;
        padding: 18px 0;
        text-align: center;
        cursor: pointer;
        i {
          vertical-align: middle;
        }
      }
      .change-skin {
        font-size: 14px;
        font-weight: 500;
        padding-right: 5px;
      }
      .switch-theme {
        height: 100%;
      }
      .user-dropdown {
        &-menu-con {
          position: absolute;
          right: 0;
          top: 0;
          // width: 150px;
          height: 100%;
          .main-user-name {
            display: inline-block;
            // width: 120px;
            font-size: 16px;
            word-break: keep-all;
            white-space: nowrap;
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
          }
        }
        &-innercon {
          height: 100%;
          padding-right: 14px;
        }
      }
      .full-screen-btn-con {
        display: inline-block;
        width: 30px;
        padding: 18px 0;
        text-align: center;
        cursor: pointer;
        i {
          vertical-align: middle;
        }
      }
      .lock-screen-btn-con {
        display: inline-block;
        width: 30px;
        padding: 18px 0;
        text-align: center;
        cursor: pointer;
        i {
          vertical-align: middle;
        }
      }
    }
  }
  .single-page-con {
    position: absolute;
    top: 100px;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: #f5f7fa;
    z-index: 1;
    transition: left 0.3s;
    .single-page {
      margin: 0 10px 10px 10px;
    }
  }
  &-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
}
.taglist-moving-animation-move {
  transition: transform 0.3s;
}
.logo-con {
  padding: 6px;
  text-align: center;
  img {
    height: 44px;
    width: auto;
  }
}
.dropdown-class{
  max-height: 300px;
}
.card-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
