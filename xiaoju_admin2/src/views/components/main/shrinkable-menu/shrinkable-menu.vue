<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu 
            v-show="!shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :open-names="openNames"
            @on-change="handleChange"
        ></sidebar-menu>
        <sidebar-menu-shrink 
            v-show="shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator (val) {
                return $utils.view.oneOf(val, ['dark', 'light']);
            }
        },
        beforePush: {
            type: Function
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        bgColor () {
            return this.theme === 'dark' ? '#303954' : '#fff';
        },
        shrinkIconColor () {
            return this.theme === 'dark' ? '#fff' : '#303954';
        }
    },
    created () {
    },
    methods: {
        handleChange (name) {
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            // 当前选项卡不跳转
            let route = this.$route
            console.log('sidebarMenu route', route)
            this.sidebarMenu_name = route.name
            if (this.sidebarMenu_name === name) {
                willpush = false
            }
            if (willpush) {
                this.$router.push({
                    name: name
                });
            }
            this.$emit('on-change', name);
        }
    }
};
</script>
