<script>
import baseList from '@/views/components/base/baseList.vue'
import Info from './info.vue'
export default {
    extends: baseList,
    components: {
        'info': Info
    },
    data () {
        return {
            menu_name: '',
            table: {
                mname: 'banner',
                key: 'id',
                url: {},
                output: false,
                order: 'sort asc, create_time desc'
            },
            menus: [
            ],
            actions: [
                {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/advert/add'},
            ],
            query: {
            },
            filters: [
                {label: '标题', name: 'title', value: '', type: 'input'},
                {label: '位置', name: 'place', value: 'home_banner', type: 'select', dropList:[
                    {value: 'home_banner', name: '首页轮播图'},
                ]},
            ],
            tableCols: [
                {title: 'ID', key: 'id', width: 80, align: 'center', sortable: 'custom' },
                {title: '封面图', key: 'image', width: 150, align: 'center', viewimage: true },
                {title: '标题', key: 'title', minWidth: 150, },
                {title: '位置', key: 'place', minWidth: 120,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.place_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {title: '链接类型', key: 'linktype', align: 'center', width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.linktype_name
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {title: '链接', key: 'linktype_alis_id', align: 'center', minWidth: 100,
                    render: (h, params) => {
                        const row = params.row;
                        const type = row.linktype
                        if (type == 0) {
                            const text = '点击查看'
                            const url = row.linkurl
                            return h('a', {
                                attrs: {
                                    target: '_blank',
                                    href: url
                                }
                            }, text);
                        } else {
                            const text = row.linktype_alis_id
                            return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                        }
                    }
                },
                {title: '显示', align: 'center', key: 'status', width: 80, switch: true, disabled: false},
                {title: '排序', align: 'center',  key: 'sort', width: 80, editable: true},
                {title: '创建时间', align: 'center', key: 'create_time',   width: 170 },
                {title: '操作', align: 'center', minWidth: 200, key: 'handle', fixed: 'right',handle: ['edit', 'delete', 'info']}    
            ]
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
