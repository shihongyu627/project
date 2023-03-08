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
            table: {
                mname: 'feedback',
                key: 'id',
                url: {},
                output: false,
            },
            actions: [
                // {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/feedback/add' },
            ],
            query: {
            },
            filters: [
                {label: '标题', name: 'title', value: '', type: 'input'},
            ],
            reply_content: '',
            tableCols: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80,
                    align: 'center',
                    // sortable: 'custom'
                },
                {
                    title: '标题',
                    key: 'title',
                    minWidth: 120,
                },
                {
                    title: '内容',
                    key: 'content',
                    minWidth: 120,
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
                {title: '截图', key: 'gallery', width: 150, align: 'center', viewimage: true },
                {
                    title: '提交者',
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
                    title: '创建时间',
                    align: 'center',
                    key: 'create_time',
                    width: 170
                },
                    {
                    title: '操作',
                    align: 'center',
                    width: 210,
                    key: 'handle',
                    handle: [
                        'edit', 'delete']
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
