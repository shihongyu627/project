<script>
import baseList from '@/views/components/base/baseList.vue'
import Info from '@/views/order/info.vue'
export default {
    extends: baseList,
    components: {
        'info': Info
    },
    data () {
        return {
            table: {
                mname: 'order',
                key: 'order_id',
                url: {},
                output: true,
            },
            filename: '待审核订单',
            menus: [
            ],
            actions: [
            ],
            query: {
                status: 7
            },
            filters: [
                {label: '标题', name: 'title', value: '', type: 'input'},
                {label: '店铺', name: 'shop_store_name', value: '', type: 'select', dropList: []},
                {label: '店铺名', name: 'shop_store_name', value: '', type: 'input'},
            ],
            tableCols: [
                {
                    title: 'ID',
                    key: 'order_id',
                    width: 80,
                    align: 'center',
                    sortable: 'custom'
                },
                {
                    title: '订单时间',
                    align: 'center',
                    key: 'create_time',
                    width: 160
                },
                {
                    title: '店铺名称',
                    key: 'shop_store_name',
                    minWidth: 120,
                    align: 'center',
                    // sortable: 'custom',
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.shop_store_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '订单商品',
                    key: 'goods_title',
                    align: 'center',
                    minWidth: 150,
                    'max-height': 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.goods_title
                        const url = row.goods_url
                        return h('a', {
                            style: {
                                margin: '5px'
                            },
                            attrs: {
                                target: '_blank',
                                href: url
                            }
                        }, text);
                    }
                },
                {
                    title: '商品金额',
                    key: 'cost_price',
                    minWidth: 100,
                    align: 'center',
                    // sortable: 'custom',
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.cost_price
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '实付金额',
                    key: 'order_fee',
                    minWidth: 100,
                    align: 'center',
                    // sortable: 'custom',
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.order_fee
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '旺旺号',
                    minWidth: 100,
                    'max-height': 100,
                    key: 'orderer_wangwang'
                },
                {
                    title: '订单号',
                    minWidth: 100,
                    key: 'order_no'
                },
                {
                    title: '订单状态',
                    key: 'status',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        let color = row.status !== 10 ? '#eee' : 'success';
                        let status = row.status !== 10 ? '#eee' : 'success';
                        let text = row.status_name;
                        if (row.status == -1) {
                            color = 'processing'
                            status = 'processing'
                        }
                        if (row.status == 0) {
                            color = 'warning'
                            status = 'warning'
                        }
                        if (row.status == 1) {
                            color = 'primary'
                            status = 'primary'
                        }
                        if (row.status == 7) {
                            color = 'success'
                            status = 'success'
                        }
                        if (row.status == 8) {
                            color = 'error'
                            status = 'error'
                        }
                        if (row.status == 9) {
                            color = 'primary'
                            status = 'primary'
                        }
                        if (row.status == 10) {
                            color = 'success'
                            status = 'success'
                        }
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                text: text,
                                color: color,
                                status: status
                            }
                        }, text);
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 190,
                    key: 'handle',
                    handle: [
                       (vm, h, currentRow, param) => {
                        return  currentRow.status === 7 ?h('Dropdown', {
                            style: {
                                margin: '4px 5px'
                            },
                            // 自定义指令
                            directives: [
                                {
                                    name: 'auth',
                                    value: '/admin/order/pass'
                                }
                            ],
                        }, [h('Button', {
                                props: {
                                    size: 'small',
                                    type: 'success',
                                },
                                on: {
                                    'click': () => {
                                        this.okOpen('pass', '审核：通过该订单', currentRow)
                                    }
                                }
                            }, '通过')
                        ]):'';
                    }, (vm, h, currentRow, param) => {
                        return  currentRow.status === 7 ?h('Dropdown', {
                            style: {
                                margin: '4px 5px'
                            },
                            // 自定义指令
                            directives: [
                                {
                                    name: 'auth',
                                    value: '/admin/order/pass'
                                }
                            ],
                        }, [h('Button', {
                                props: {
                                    size: 'small',
                                    type: 'error',
                                },
                                on: {
                                    'click': () => {
                                        this.okOpen('nopass', '审核：拒绝该订单', currentRow)
                                    }
                                }
                            }, '拒绝')
                        ]):'';
                    },  'info'],
                }
            ]
        }
    },
    created () {
        let query = this.$route.query
        this.loadFiltersFieldDrop('shop_store', 'shop_store_name')
        if(query.shop_store_name) {
            // 设置查询参数
            this.shop_store_name = query.shop_store_name
            this.query.shop_store_name = query.shop_store_name
        }
    },
    methods: {
        
        okOpen (type, title, row) {
            this.$Modal.confirm({
                title: title,
                content: `
                    <p> 订单ID: ${row.order_id}</p>
                    <p>订单编号: ${row.order_no}</p>
                    <p>订单商家: ${row.shop && row.shop.shop_name}</p>
                    <p>订单标题: ${row.title}</p>
                `,
                onOk: () => {
                    this.okHandle(type, title, row);
                },
                onCancel: () => {
                    //;
                }
            });
        },
        // 状态操作处理
        okHandle (type, title, row) {
            let q = {}
            q.order_id = row.order_id
            q.shop_id = row.shop_id
            if(q.order_id==''||q.shop_id==''){
               return $utils.toast.error('请求数据错误');
            }
            let ajaxType = ''
            switch (type) {
                case 'cancel':
                    ajaxType = "orderCancel"
                    break;
                case 'back':
                    ajaxType = "orderBack"
                    break;
                case 'del':
                    ajaxType = "orderDel"
                    break;
                case 'pass':
                    ajaxType = "orderPass"
                    q.pass_status = 1
                    break;
                case 'nopass':
                    ajaxType = "orderPass"
                    q.pass_status = 2
                    break;
                case 'makemoney':
                    ajaxType = "orderMakemoney"
                    break;
                case 'complete':
                    ajaxType = "orderComplete"
                    break;
                default:
                    break;
            }
            if(!ajaxType){
                return $utils.toast.error('操作方式错误');
            }
            $utils.api.load(ajaxType, q, 'post', {toast: false, toasterror: false}).then((res)=>{
                if (res.status) {
                    this.modalRow = {};
                    this.modalBox = false
                    this.search()
                }
                $utils.toast.text(res.message);
            }).catch(() => {
                $utils.toast.error('数据异常');
            })
        },
    }
}
</script>
