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
                mname: 'smsLog',
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
                {label: '内容', name: 'text', value: '', type: 'input'},
                {label: '场景', name: 'scene', value: '', type: 'select', dropList:[
                    {value: 'register', name: '注册验证码'},
                ]},
            ],
            tableCols: [
                {title: 'ID', key: 'id', width: 80, align: 'center'},
                {title: '手机号', key: 'mobile', minWidth: 120, },
                {title: '场景', key: 'scene', minWidth: 120, 
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.scene_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {title: '验证码', key: 'smscode', minWidth: 120, },
                {title: '内容', key: 'text', minWidth: 150, },
                // {title: '显示', align: 'center', key: 'status', width: 80, switch: true, disabled: false},
                // {title: '排序', align: 'center', sortable: 'custom', key: 'sort', width: 80, editable: true},
                {title: '创建时间', align: 'center', key: 'create_time', width: 170 },
                // {title: '操作', align: 'center', minWidth: 120, key: 'handle', handle: ['delete',]}    
            ]
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
