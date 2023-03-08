<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
    extends: baseList,
    components: {
    },
    data () {
        return {
            table: {
                mname: 'upload',
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
                {label: '关键词', name: 'sourcename', value: '', type: 'input'},
            ],
            tableCols: [
                {
                    title: 'Code',
                    key: 'code',
                    width: 130,
                },
                {
                    title: '封面图',
                    key: 'sourcename',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const url = $utils.image.load(row.url || (row.savepath + row.savename))
                        return h('img', {
                                domProps: {
                                    src: url
                                },
                                style: {
                                    margin: '5px auto',
                                    width: 'auto',
                                    height: '60px'
                                }
                            });
                    }
                },
                {
                    title: '路径',
                    key: 'savepath',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const url = row.url||(row.savepath + row.savename)
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
                    title: '大小',
                    key: 'size',
                    width: 120,
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 120,
                },
                {
                    title: '后缀',
                    width: 100,
                    key: 'ext',
                },
                {
                    title: '上传时间',
                    key: 'create_time',
                    width: 170,
                },
                // {
                //     title: '操作',
                //     align: 'center',
                //     width: 120,
                //     key: 'handle',
                //     handle: ['delete']
                // }
            ]
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
