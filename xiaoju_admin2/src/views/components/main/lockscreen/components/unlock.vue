<style lang="less">
    @import '../styles/unlock.less';
</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" :src="avatorPath">
                <div  class="unlock-avator-cover">
                    <span><Icon type="md-unlock" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                        <Button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"><Icon color="white" type="md-key"></Icon></Button>
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">
                <div v-if="!islogin">已锁定 </div>
                <Button v-if="islogin" type="text" @click="toLogin">重新登录</Button>
            </div>
        </div>
    </transition>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'Unlock',
    data () {
        return {
            avatorLeft: '0px',
            inputLeft: '400px',
            password: '',
            check: null,
            islogin: false,
        };
    },
    props: {
        showUnlock: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        avatorPath () {
            return $utils.data.get('auth', 'avatar');
        }
    },
    methods: {
        // validator () {
        //     return true; // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
        // },
        handleClickAvator () {
            this.avatorLeft = '-180px';
            this.inputLeft = '0px';
            this.$refs.inputEle.focus();
            this.islogin = true;
        },
        handleUnlock () {
            let q = {}
            q.username = $utils.data.get('auth', 'username');
            q.password = this.password
            q.style = 'all'
            q.scene = 'lock'
            $utils.api.load('authLogin', q, 'get', {}).then((res)=>{
                if(res.data && res.data.type == 100){
                    this.avatorLeft = '0px';
                    this.inputLeft = '400px';
                    this.password = '';
                    Cookies.set('locking', '0');
                    this.$emit('on-unlock');
                } else {
                    this.$Message.error('密码错误,请重新输入。如果忘了密码，请重新登录');
                }
            })
        },
        unlockMousedown () {
            this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
        },
        unlockMouseup () {
            this.$refs.unlockBtn.className = 'unlock-btn';
        },
        toLogin () {
            // 退出登录
            $utils.api.load('authLogout').then((res)=>{
                this.$store.commit('logout', this);
                Cookies.set('locking', '0');
                this.$router.push({
                    name: 'login'
                });
            })
        }
    }
};
</script>
