<template>
<div>
    <box-header>
        <Row slot="left" :gutter="2">
            <Button type="primary"  @click="toAdd">新增权限 - {{query.pid}}</Button>
            <Button type="info" icon='arrow-up-c'  @click="toUp" v-if="ppids.length >0 ">向上</Button>
        </Row>
        <Row slot="right" :gutter="8">
            <Col span="15">
            <Input placeholder="关键词" v-model="query.title"></Input>
            </Col>
            <Col span="4">
                <Button icon="search" @click="search">搜索</Button>
            </Col>
        </Row>
    </box-header>
    <Row >
        <edit-table ref="tablelist" :url="url" :query="query"  :table="table" :columns-list="tableCols" @on-edit="handleEdit" @on-del="handleDel"></edit-table>
    </Row>
</div>
</template>
<script>

    export default {
        components: {
        },
        data () {
            return {
                url: '',
                query: {
                    pid: 1,
                    title: ''
                },
                table: {
                    mname: 'authRule',
                    key: 'id',
                    url: {}
                },
                ppids: [], // 向上按钮的父级集合 push / pop
                tableCols: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 80,
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '规则名称',
                        key: 'name'
                        
                    },
                    {
                        title: '分组',
                        key: 'group'
                    },
                    {
                        title: '路由',
                        key: 'url'
                    },
                    {
                        title: '标识',
                        key: 'tag'
                    },
                    {
                        title: '限制',
                        key: 'condition'
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
                        title: '排序',
                        align: 'center',
                        sortable: 'custom',
                        key: 'sort',
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 190,
                        key: 'handle',
                        handle: [(vm, h, currentRow, param) => {
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    type: 'info',
                                },
                                style: {
                                    margin: '0 5px'
                                },
                                on: {
                                    'click': () => {
                                        // 替换pid
                                        this.query.pid = currentRow.id
                                        this.ppids.push(currentRow.pid)
                                        this.search()
                                    }
                                }
                            }, '列表');
                        }, 'edit', 'delete']
                    }
                    
                ]
            }
        },
        mounted() {
    this.search()
  },
        methods: {
            search () {
                this.$refs.tablelist.init()
            },
            toAdd () {
                $utils.url.push({name: 'auth_rule_add', query: {action: 'add', pid: this.query.pid}})
            },
            toUp () {
                // 替换pid
                this.query.pid = this.ppids.pop()
                this.search()
            },
            handleEdit (row) {
                $utils.url.push({name: 'auth_rule_edit', query: {action: 'edit', kv: row.id} })
            },
            handleDel (row) {
            }
        }
    }
</script>
