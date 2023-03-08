<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openMemus" :accordion="true" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList"  >
            <template v-if="item.name === 'blank'"> <!-- 空白条 -->
                <MenuItem v-if="(item.children.length<=1) && (item.show != false)" :name="item.children[0].name" :key="'menuitem' + item.name" style="padding-top:2px;padding-bottom:2px;">
                    <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                    <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
                </MenuItem>
            </template>
            <template v-else >
                <MenuItem v-if="(item.children.length<=1) && (item.show != false)" :name="item.children[0].name" :key="'menuitem' + item.name">
                    <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                    <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
                </MenuItem>
            </template>

            <Submenu v-if="(item.children.length > 1) && (item.style !== 'box')" :name="item.name" :key="item.name" >
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <template v-if="(child.show != false)">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                    </template>
                </template>
            </Submenu>

            <Submenu v-if="(item.children.length > 1) && (item.style === 'box')" :name="item.name" :key="item.name" style="overflow:hidden;">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <template v-if="(child.show != false)">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name" class="box-sub-item">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text"  :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                    </template>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: {
            type: Number,
            default: 18
        },
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        openMemus () {
            // 遍历路由判断是否有一直需要打开的目录
            // for (const m in this.menuList) {
            //     let item = this.menuList[m]
            //     if(item.openmenu){
            //         this.openNames.push(item.name)
            //     }
            // }
            // return this.openNames
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
<style lang="less" scoped>
.box-sub-item{
    width:50%;
    float:left;
    padding-left: 12% !important;

    .layout-text{
        margin-left: 0px;
    }
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
	border-right: none;
	color: #2d8cf0 !important;
    background: none !important;
}
</style>

