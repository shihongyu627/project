<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            menu_name: '',
            table: {
                mname: 'payment',
                key: 'id',
                url: {},
                output: false,
            },
            menus: [
            ],
            actions: [
            ],
            query: {
            },
            filters: [
                // {label: '标题', name: 'pay_body', value: '', type: 'input'},
                // {label: '内容', name: 'pay_detail', value: '', type: 'input'},
                {label: '流水号', name: 'out_trade_no', value: '', type: 'input'},
                {label: '交易编号', name: 'trade_no', value: '', type: 'input'},
                {label: '支付时间', name: 'pay_time', value: '', type: 'datetimerange'},
                {label: '支付状态', name: 'pay_status', value: 1, type: 'select', dropList:[
                    {value: '1', name: '已支付'},
                    {value: '0', name: '未支付'},
                ]},
            ],
            tableCols: [
                {title: '流水号', key: 'out_trade_no', minWidth: 160, align: 'center', copy:true,},
                {title: '标题', key: 'pay_body', minWidth: 100, },
                // {title: '内容', key: 'pay_detail', minWidth: 120, },
                {title: '场景', key: 'scene', minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.scene_name
                        return (
                              <span style={{'font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {title: '总金额', key: 'original_money', minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = `￥${ row.original_money}`
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
                {title: '已支付', key: 'pay_money', minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = `￥${ row.pay_money}`
                         return (
                              <span style={{ color: 'green','font-weight': 'bold','font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         color: 'green',
                        //         'font-weight': 'bold',
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {title: '支付方式', key: 'pay_ment', align: 'center', minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.pay_ment_name
                        return (
                              <span style={{'font-size': '14px'}}>{text}</span>
                        )
                        // return h('span', {
                        //     style: {
                        //         'font-size': '14px'
                        //     }
                        // }, text);
                    }
                },
                {title: '支付状态', key: 'pay_status', minWidth: 100, align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.pay_status === 1 ? 'success' : 'error';
                        const text = row.pay_status === 1 ? '成功' : '失败';

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {title: '交易编号', key: 'trade_no', minWidth: 160, copy:true, },
                {title: '支付时间', key: 'pay_time',  width: 170, align: 'center',},
                {title: '创建时间', align: 'center', key: 'create_time', width: 170 }, 
            ]
        }
    },
    created () {
    },
    methods: {
    }
}
</script>