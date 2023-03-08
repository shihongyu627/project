<template>
<div>
    <h3>选择用户</h3>
    <h5>点击即可选择</h5>
    <box-header>
        <Row slot="left">
            <Button type="error" icon="ios-close-circle-outline" @click="clear">清除选择</Button>
        </Row>
        <Row slot="right">
            <Input placeholder="昵称" style="width:200px;"  search v-model="query.user_nick" @on-search="search" @on-enter="search" />
           <Input placeholder="手机号" style="width:200px;" search   v-model="query.user_mobile" @on-search="search" @on-enter="search" />
        </Row>
    </box-header>
    <Row >
        <edit-table ref="tablelist" :output='false' :url="url" :query="query"  :table="table" :savepage="false" :columns-list="tableCols" @on-click="clickRow" ></edit-table>
    </Row>
</div>
</template>
<script>

export default {
    name: 'popUser',
    components: {
    },
    props: {
        name: String,
        query: {
            type: Object,
            default: () => {
              return {
                user_nick: '',
                user_mobile: '',
              }
            }
        }
    },
    data () {
        return {
            url: '',
            // query: {     // 用props的query替换
            // },
            table: {
                tname: 'user',
                key: 'uid',
                url: {
                    list: 'userList'
                }
            },
            tableCols: [
                {
                    title: 'UID',
                    key: 'uid',
                    width: 100,
                    align: 'center',
                },
                {
                    title: '昵称',
                    key: 'user_nick',
                    minWidth: 100,
                },
                {
                    title: '头像',
                    key: 'user_head',
                    width: 70,
                    isAvatar: true,
                    viewimage: true
                },
                {
                    title: '手机号',
                    key: 'user_mobile',
                    minWidth: 150,
                },
                {
                    title: '性别',
                    key: 'user_gender',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.user_gender == 1 ? 'blue' : row.user_gender == 2 ? 'red' : '';
                        const text = row.user_gender == 1 ? '男' : row.user_gender == 2 ? '女' : '';
                        return h('span', {
                            style: {
                                'font-size': '14px',
                                 color: color
                            }
                        }, text);
                    }
                },
                {
                    title: '类型',
                    key: 'user_type',
                    minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.user_type_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
            ],
        };
    },
    watch: {
        query (v) {
            // this.search()
        }
    },
    created () {
    },
    mounted () {
        this.search()
    },
    methods: {
        search () {
            this.$refs.tablelist.page.page = 1
            this.$refs.tablelist.init()
        },
        clear () {
            this.$emit('on-clear', null)
        },
        clickRow (row, index) {
            this.$emit('on-click', row)
        }
    },
};
</script>
<style lang="less">

</style>


