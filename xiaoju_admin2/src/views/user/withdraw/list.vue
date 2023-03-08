<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'userWithdraw',
                key: 'id',
                url: {},
                output: false,
                order: 'status asc, is_export asc, create_time desc'
            },
            menus: [
                // {label: '用户列表', name: 'user_list', auth: '/admin/user/lists'},
                // {label: '实名认证', name: 'user_real_list', auth: '/admin/userreal/lists'},
                // {label: '提现待审核', name: 'user_withdraw_list', auth: '/admin/userwithdraw/lists'},
                // {label: '提现已导出', name: 'user_withdraw_export', auth: '/admin/userwithdraw/export'},
            ],
            actions: [
                {label: '新增提现', name: 'add', icon: 'md-add', onClick: this.toAdd, auth: '/admin/userwithdraw/add'},
            ],
            query: {
            },
            filters: [
                {label: '姓名', name: 'account_realname', value: '', type: 'input'},
                {label: '提现状态', name: 'status', value: '', type: 'select', dropList:[
                    {value: 0, name: '待审核'},
                    {value: 1, name: '已审核'},
                    {value: 2, name: '已拒绝'},
                ]},
            ],
            tableCols: [
                // {
                //     title: 'ID',
                //     key: 'id',
                //     width: 80,
                //     align: 'center',
                // },
                {
                    title: '用户',
                    key: 'uid',
                    user: 'user',
                    width: 150
                },
                {
                    title: '用户余额',
                    key: 'balance',
                    minWidth: 100
                },
                {
                    title: '账户类型',
                    key: 'account_type_name',
                    minWidth: 120
                },
                {
                    title: '账户名称',
                    minWidth: 100,
                    key: 'account_name'
                },
                {
                    title: '姓名',
                    minWidth: 100,
                    key: 'account_realname'
                },
                {
                    title: '账号',
                    minWidth: 120,
                    key: 'account_number'
                },
                {
                    title: '分行信息',
                    minWidth: 120,
                    key: 'account_bank'
                },
                {
                    title: '结算月份',
                    minWidth: 120,
                    key: 'yearmonth'
                },
                {
                    title: '实际金额',
                    key: 'real_fee',
                    minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = `￥${ row.real_fee}`
                         return (
                              <span style={{ color: 'red','font-weight': 'bold','font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         color: 'red',
                        //         'font-weight': 'bold',
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {
                    title: '申请金额',
                    key: 'fee',
                    minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = `￥${ row.fee}`
                          return (
                              <span style={{ color: '#333','font-weight': 'bold','font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         color: '#333',
                        //         'font-weight': 'bold',
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {
                    title: '手续费',
                    key: 'service_fee',
                    minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = `￥${ row.service_fee}`
                         return (
                              <span style={{ color: '#333','font-weight': 'bold','font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         color: '#333',
                        //         'font-weight': 'bold',
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {
                    title: '提交时间',
                    key: 'create_time',
                    width: 170,
                    align: 'center',
                },
                {
                    title: '审核意见',
                    minWidth: 120,
                    key: 'pass_content'
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        const row = params.row;
                        let color = row.status == 1 ? 'primary' : row.status == 2 ? 'error' : 'success';
                        if (row.is_export){
                            color = '#fff'
                        }
                        let text = row.status_name;

                        if (row.status == 0) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'success'
                                    },
                                    style: {
                                        margin: '0 5px'
                                    },
                                    // 自定义指令
                                    directives: [
                                        {
                                            name: 'auth',
                                            value: '/admin/userwithdraw/pass'
                                        }
                                    ],
                                    on: {
                                        'click': () => {
                                            this.$set(this.pass,'model',true);
                                            this.$set(this.pass,'status',1);
                                            this.$set(this.pass,'kv',row.id);
                                            this.$set(this.pass,'content','审核通过');
                                        }
                                    }
                                }, '通过'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'error'
                                    },
                                    style: {
                                        margin: '0 5px'
                                    },
                                    // 自定义指令
                                    directives: [
                                        {
                                            name: 'auth',
                                            value: '/admin/userwithdraw/pass'
                                        }
                                    ],
                                    on: {
                                        'click': () => {
                                            this.$set(this.pass,'model',true);
                                            this.$set(this.pass,'status',2);
                                            this.$set(this.pass,'kv',row.id);
                                            this.$set(this.pass,'content','');
                                        }
                                    }
                                }, '拒绝')
                            ]);
                        } else {
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    type: color
                                },
                                on: {
                                    'click': () => {
                                    }
                                }
                            }, text);
                        }
                    }
                },
            ]
        }
    },
    created () {
        this.loadBalanceData()
    },
    methods: {
        loadBalanceData () {
            // 查询余额
            let q = {}
            q.type = "balance";
            $utils.api.load('userQueryMoney', q, 'get', { toast: false, toasterror: false, loading: false, login: false }).then((res) => {
                if(res && res.data){
                    // 余额
                    let data = res.data || {}
                    for (let index = 0; index < this.actions.length; index++) {
                        const element = this.actions[index];
                        if(element && element.name == 'add') {
                            this.actions[index].label =  '提现' + '  ￥' + data.balance + ''
                        }
                    }
                    console.log('userMoney ', res.data)
                }
            })
        },
    }
}
</script>
