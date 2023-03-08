<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'notice',
                key: 'id',
                url: {},
                output: false,
            },
            menus: [
            ],
            actions: [
                {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/notice/add' },
            ],
            query: {
            },
            filters: [
                {label: '标题', name: 'title', value: '', type: 'input'},
            ],
            tableCols: [
                // {
                //     title: 'ID',
                //     key: 'id',
                //     width: 80,
                //     align: 'center',
                //     sortable: 'custom'
                // },
                {
                    title: '发布者',
                    key: 'user',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.user && row.user.user_nick
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '标题',
                    key: 'title',
                    minWidth: 160,
                },
                {
                    title: '内容',
                    key: 'content',
                    minWidth: 220,
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.content
                        return h('span', {
                            style: {
                                'font-size': '14px'
                            }
                        }, text);
                    }
                },
                {
                    title: '排序',
                    align: 'center',
                    sortable: 'custom',
                    key: 'sort',
                    width: 90,
                    editable: true
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'create_time',
                    width: 170
                },
                    {
                    title: '操作',
                    align: 'center',
                    width: 160,
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
