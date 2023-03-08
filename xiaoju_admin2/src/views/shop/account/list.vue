<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'shopAccount',
                key: 'id',
                url: {},
                output: false,
            },
            menus: [
                {label: '商家列表', name: 'shop_list', auth: '/admin/shop/lists'},
                {label: '商家账号', name: 'shop_account_list', auth: '/admin/shopaccount/lists'},
                {label: '充值记录', name: 'shop_recharge_list', auth: '/admin/shoprecharge/lists'},
            ],
            actions: [
                {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/shopaccount/add'},
            ],
            query: {
            },
            filters: [
            ],
            tableCols: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80,
                    align: 'center',
                    sortable: 'custom'
                },
                {
                    title: '商家名称',
                    key: 'shop_id',
                    sortable: 'custom',
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.shop && row.shop.shop_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '用户',
                    key: 'uid',
                    user: 'user',
                    sortable: 'custom',
                    // width: 150
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    width: 80,
                    switch: true,
                    disabled: false
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'create_time',
                    sortable: 'custom',
                    width: 160
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 150,
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
