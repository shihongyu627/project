<template>
<Row >
    <Col >
        <DatePicker :value="date" @on-change="handleChange" :type="type" :options="options" :format="format" :placeholder="placeholder" style="width: 200px"></DatePicker>
    </Col>
</Row>
</template>

<script>
export default {
    name: 'formDate',
    components: {
    },
    props: {
        value: {  // 日期值，[区间·开始时间]
            type: String,
            default: () => {
              return $utils.time.now()
            }
        },
        end: String,    // [区间·结束时间]
        type: {
            type: String,
            default: () => {
              return {
              }
            }
        },
        format: String,
        placeholder: {
            type: String,
            default: () => {
              return '选择日期时间'
            }
        },
        options: {
            type: Object,
            default: () => {
              return {}
            }
        },
    },
    data () {
        return {
            // date: null,
        };
    },
    computed: {
      date: function () {
        // 时间区间
        if(this.end){
            return [this.value, this.end]
        } else {
            return this.value  
        }
      }
    },
    created () {
    },
    mounted () {
        this.handleChange(this.value)
    },
    methods: {
        handleChange (val) {
            this.$emit('on-change', val)
            // 时间格式化
            if(val){
                 // 时间区间
                if(this.end){
                    this.$emit('input', val[0])
                    this.$emit('update:end', val[1])
                } else {
                    this.$emit('input', val)
                }
                console.log('formDate handleChange', val)
            }
        },
    },
};
</script>
<style lang="less">
</style>


