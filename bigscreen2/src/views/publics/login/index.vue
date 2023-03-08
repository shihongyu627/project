<template>
  <div class="login-container">
    <el-row style="width:100%;height:100%" :span="24">
      <el-col :span="12" style="height:100%">
        <div class="login-bg">
          <div class="login-content">
            <div class="login-title">您好，</div>
            <div class="login-text">欢迎使用AIoT 智能管理平台</div>
          </div>
          <div class="login-br"></div>
          <div class="login-imgBox">
            <img class="login-img" src="../../../assets/image/login_bg.png" />
          </div>
        </div>
      </el-col>

      <el-col :span="12" class="login-right" style="height:100%">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">
              <span style="color:#3B7FF6;font-size:36px">AIoT</span>
              智能管理平台
            </h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入AIoT平台账号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入登录密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-radio-group
            class="select-radio"
            v-model="radio1"
            @change="onChangeRadio"
            size="small"
          >
            <el-radio label="1">数字大屏</el-radio>
            <el-radio label="2">数据后台</el-radio>
          </el-radio-group>
          <el-button
            :loading="loading"
            style="width:100%;margin-bottom:30px;background:#3B7FF6;color:#fff;height:54px"
            @click.native.prevent="handleLogin"
            >登 录</el-button
          >
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的AIoT平台账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      radio1: "1"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("提交有误!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    onChangeRadio(data) {
      console.log(data);
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/aigoubuluo/pull/927 */

$bg: #fff;
$light_gray: #000;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  display: flex;
  align-items: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: $bg;
      border: 1px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .login-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(107.3deg, #6d8dff 0%, #2e51f3 100%);
    width: 100%;
    height: 100%;
    .login-content {
      margin-top: 146px;
      .login-title {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: bold;
        font-size: 30px;
        color: #fff;
      }
      .login-text {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: bold;
        font-size: 40px;
        color: #fff;
        margin-top: 15px;
      }
    }
    .login-br {
      width: 532px;
      height: 3px;
      background: #6282fc;
      margin-top: 35px;
    }
    .login-imgBox {
      width: 586px;
      height: 646px;
      .login-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .el-form-item {
    border: 1px solid #c6cbd6;
    background: $bg;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 39px;
  }
  .el-form-item__error {
    padding-top: 10px;
  }
  .select-radio {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 54px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #c6cbd6;
$light_gray: #000;

.login-container {
  width: 100%;
  background-color: $bg;
  margin: 0;
  padding: 0;
  height: 100%;
  // background: -webkit-linear-gradient(
  //   left,
  //   rgba(0, 38, 190, 0.893),
  //   rgb(20, 175, 242)
  // ); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient(
  //   right,
  //   rgba(0, 38, 190, 0.893),
  //   rgb(20, 175, 242)
  // ); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(
  //   right,
  //   rgba(0, 38, 190, 0.893),
  //   rgb(20, 175, 242)
  // ); /* Firefox 3.6 - 15 */
  // background: linear-gradient(
  //   to right,
  //   rgba(0, 38, 190, 0.893),
  //   rgb(20, 175, 242)
  // ); /* 标准的语法 */
  overflow: hidden;
  .login-right{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-form {
    position: relative;
    width: 370px;
    max-width: 100%;
    // padding: 180px 35px 0;
    padding-bottom: 110px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
