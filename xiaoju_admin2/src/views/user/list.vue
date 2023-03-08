<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'user',
                key: 'uid',
                url: {},
                output: false,
            },
            menus: [
            ],
            actions: [
                // {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/user/add'},
            ],
            tactions: [
              { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '用户数据', 0), auth: '/admin/user/lists' },
              { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '用户数据', 1), auth: '/admin/user/lists' },
            ],
            query: {
                // user_type: 1
            },
            filters: [
                {label: '昵称', name: 'user_nick', value: '', type: 'input'},
                {label: '手机号', name: 'user_mobile', value: '', type: 'input'},
                {label: '性别', name: 'user_gender', value: '', type: 'select', dropList:[
                    {value: 1, name: '男'},
                    {value: 2, name: '女'},
                ]},
            ],
            tableCols: [
                {
                  type: 'selection',
                  width: 60,
                },
                {
                    title: 'UID',
                    key: 'uid',
                    width: 80,
                    align: 'center',
                },
                // {
                //     title: '账号',
                //     key: 'username',
                //     width: 150,
                // },
                {
                    title: '头像',
                    key: 'user_head',
                    width: 80,
                    isAvatar: true,
                    viewimage: true
                },
                {
                    title: '昵称',
                    key: 'user_nick',
                    minWidth: 120,
                },
                {
                    title: '性别',
                    key: 'user_gender',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.user_gender == 1 ? 'blue' : row.user_gender == 2 ? 'red' : '';
                        const text = row.user_gender == 1 ? '男' : row.user_gender == 2 ? '女' : '';
                         return (
                              <span style={{ color: color,'font-size': '14px'}}>{text}</span>
                        )
                    }
                },
                {
                    title: '手机',
                    key: 'user_mobile',
                    minWidth: 150,
                    copy: true
                },
                {
                    title: '账号类型',
                    key: 'user_type',
                    minWidth: 120,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.user_type_name
                         return (
                              <span style={{'font-size': '14px'}}>{text}</span>
                        )
                    }
                },
                {
                    title: '余额',
                    key: 'balance',
                    minWidth: 100,
                    align: 'center',
                },
                {
                    title: '实际消费',
                    key: 'order_total',
                    minWidth: 100,
                    align: 'center',
                },
                // {
                //     title: '实际骑行数',
                //     key: 'order_count_real',
                //     minWidth: 110,
                //     align: 'center',
                // },
                // {
                //     title: '实名状态',
                //     key: 'is_real',
                //     width: 150,
                //     align: 'center',
                //     render: (h, params) => {
                //         const row = params.row;
                //         let color = row.is_real === 0 ? '#eee' : row.is_real === 2 ? 'error': row.is_real === 3 ? 'error': row.is_real === 1 ? 'success':'#fff';
                //         let text = row.is_real === 0 ? '待实名' : row.is_real === 2 ? '实名拒绝':row.is_real === 3 ? '黑名单': row.is_real === 1 ? '已实名':'';
                //         return h('Tag', {
                //             props: {
                //                 type: 'dot',
                //                 color: color
                //             }
                //         }, text);
                //     }
                // },
                {
                    title: '账号状态',
                    align: 'center',
                    key: 'status',
                    width: 100,
                    switch: true,
                    disabled: false
                },
                {
                    title: '访问信息',
                    key: 'create_time',
                    minWidth: 220,
                    align: 'left',
                    render: (h, params) => {
                        const row = params.row;
                        if (row) {
                            let l0= `活跃时间: `
                            let l1= `最近登录: ${row.last_login_time||''}`
                            let l2= `注册时间: ${row.create_time||''}`
                            return h('div', {
                                      style: {
                                        margin: '2px 0',
                                        'text-align': 'left',
                                        'font-size': '13px',
                                      }
                                    },[
                                h('div', {
                                    style: {
                                        margin: '0',
                                        color: '#ff2200'
                                    }
                                }, [
                                    h('span', {
                                        style: {
                                        }
                                    }, l0),
                                    row.last_login_time ?h('Time', {
                                        props: {
                                            time: row.last_login_time,
                                            interval: 1
                                        },
                                        style: {
                                            color: '#ff2200'
                                        }
                                    }, {}):null
                                ]),
                                h('div', {
                                    style: {
                                        margin: '0',
                                        color: '#ff9900'
                                    }
                                }, l1),
                                h('div', {
                                    style: {
                                        margin: '0',
                                        color: '#19be6b'
                                    }
                                }, l2),
                            ]);
                        }
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 210,
                    key: 'handle',
                    fixed: 'right',
                    handle: ['edit', 'delete', 'sync']
                }
            ]
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
