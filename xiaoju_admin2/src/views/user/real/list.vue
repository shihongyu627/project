<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'userReal',
                key: 'id',
                url: {},
                output: false,
                order: "status asc, create_time desc"
            },
            menus: [
                {label: '用户列表', name: 'user_list', auth: '/admin/user/lists'},
                {label: '实名认证', name: 'user_real_list', auth: '/admin/userreal/lists'},
                {label: '提现待审核', name: 'user_withdraw_list', auth: '/admin/userwithdraw/lists'},
                {label: '提现已导出', name: 'user_withdraw_export', auth: '/admin/userwithdraw/export'},
            ],
            actions: [
                // {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/userreal/add'},
            ],
            query: {
            },
            filters: [
                {label: '姓名', name: 'realname', value: '', type: 'input'},
                {label: '状态', name: 'status', value: '', type: 'select', dropList:[
                    {value: 0, name: '待审核'},
                    {value: 1, name: '已通过'},
                    {value: 2, name: '已拒绝'},
                    {value: 3, name: '黑名单'},
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
                    title: '身份证号',
                    minWidth: 150,
                    key: 'idcard'
                },
                {
                    title: '银行卡',
                    key: 'user_bank',
                    minWidth: 200,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const l1= ` 银行: ${row.user_bank && row.user_bank.bank_name||''}`
                        const l2= ` 卡号: ${row.user_bank && row.user_bank.account_number||''}`
                        const l3= ` 姓名: ${row.user_bank && row.user_bank.realname||''}`
                        return h('div', {
                                  style: {
                                    margin: '5px 0',
                                    'text-align': 'left'
                                  }
                                },[
                            h('div', {
                                style: {
                                    margin: '5px 5px',
                                    color: '#ff9900'
                                }
                            }, l1),
                            h('div', {
                                style: {
                                    margin: '5px 5px',
                                    color: '#19be6b'
                                }
                            }, l2),
                            h('div', {
                                style: {
                                    margin: '5px 5px',
                                    color: '#2b85e4'
                                }
                            }, l3)
                        ]);
                    }
                },
                {
                    title: '手持证件照',
                    key: 'idcardimg3',
                    width: 150,
                    align: 'center',
                    viewimage: true
                },
                {
                    title: '提交时间',
                    key: 'create_time',
                    width: 160,
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
                    minWidth: 190,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status == 1 ? 'primary' : row.status == 2 ? 'error':   row.status == 3 ?'#333':'' ;
                        const text =  row.status == 1 ? '已通过'   : row.status == 2 ? '未通过' :  row.status == 3 ? '黑名单':'未审核';

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
                                    on: {
                                        'click': () => {
                                            this.$set(this.pass,'model',true);
                                            this.$set(this.pass,'status',2);
                                            this.$set(this.pass,'kv',row.id);
                                            this.$set(this.pass,'content','');
                                        }
                                    }
                                }, '拒绝'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'error'
                                    },
                                    style: {
                                        margin: '0 5px',
                                        'background-color': '#333',
                                        'border-color': '#333',
                                        color: '#fff'
                                    },
                                    on: {
                                        'click': () => {
                                            this.$set(this.pass,'model',true);
                                            this.$set(this.pass,'status',3);
                                            this.$set(this.pass,'kv',row.id);
                                            this.$set(this.pass,'content','');
                                        }
                                    }
                                }, '拉黑')
                            ]);
                        } else {
                            return h('div', {}, [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: color
                                    },
                                    on: {
                                        'click': () => {
                                        }
                                    }
                                }, text),
                                row.status !== 3? h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'error'
                                    },
                                    style: {
                                        margin: '0 5px',
                                        'background-color': '#333',
                                        'border-color': '#333',
                                        color: '#fff'
                                    },
                                    on: {
                                        'click': () => {
                                            this.$set(this.pass,'model',true);
                                            this.$set(this.pass,'status',3);
                                            this.$set(this.pass,'kv',row.id);
                                            this.$set(this.pass,'content','');
                                        }
                                    }
                                }, '拉黑'):null
                            ])
                            ;
                        }
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 150,
                    key: 'handle',
                    handle: ['edit', 'delete']
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
