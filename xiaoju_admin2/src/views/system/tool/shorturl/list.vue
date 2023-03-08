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
                mname: 'shorturl',
                key: 'id',
                url: {},
                output: false,
            },
            menus: [
            ],
            actions: [
                {label: '新增', icon: 'md-add', onClick: this.toAdd },
            ],
            query: {
            },
            filters: [
                {label: '内容', name: 'content', value: '', type: 'input'},
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
                    title: 'Code',
                    key: 'code',
                    width: 130,
                },
                {
                    title: '短链接',
                    key: 'url',
                    copy: true,
                    minWidth: 150,
                },
                {
                    title: '原链接',
                    key: 'source_url',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const url = row.source_url
                        const text = url
                        return h('a', {
                            attrs: {
                                target: '_blank',
                                href: url
                            }
                        }, text);
                    }
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 120,
                },
                {
                    title: '内容',
                    key: 'content',
                    minWidth: 120,
                },
                {
                    title: '点击量',
                    width: 100,
                    key: 'click_count',
                },
                {
                    title: '有效',
                    align: 'center',
                    key: 'status',
                    width: 80,
                    switch: true,
                    disabled: false
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    width: 170,
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
