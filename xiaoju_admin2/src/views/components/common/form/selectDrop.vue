<template>
<Row >
    <Select :value="value" :disabled="disabled" clearable filterable label-in-value @on-change="handleSelect" :placeholder="placeholder" style="width:200px" >
        <Option :value="v.id" v-for="(v, index) in list" :key="index">{{v.name}}</Option>
    </Select>
</Row>
</template>

<script>
export default {
        name: 'selectDrop',
        props: {
            type: {
                type: String,
                default: 'dict'
            },
            query: {
                type: Object,
                default: {}
            },
            value: {
                type: String,
                default: ''
            },
            name: String,
            pk: String,
            placeholder: String,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                list: []
            }
        },
        created() {
            this.setdata()
        },
        methods: {
            setdata () {
                if (this.type == 'dict') {
                    // 通过pk查询字典数据
                    let q = {}
                    q.pk = this.pk
                    $utils.api.load('dictionaryDropList', q).then((res) => {
                        if(res.data){
                            this.list = res.data
                        }
                    })
                }
                if (this.type == 'user_level') {
                    // 通过pk查询字典数据
                    let q = this.query || {}
                    $utils.api.load('userLevelDropList', q).then((res) => {
                        if(res.data){
                            this.list = res.data
                            // let ll = []
                            // for (let index = 0; index < banklist.length; index++) {
                            //     const item = banklist[index];
                            //     item.key = item.code
                            //     ll.push(item)
                            // }
                            // this.list = ll
                        }
                    })
                }
            },
            handleSelect (v) {
                this.$emit('input', v.value)
                this.$emit('update:name', v.label)
                console.log('handleSelect ', v)
            },
        }
    };
</script>
<style lang="less">
</style>


