<template>
<div style="">
    <Row style='margin:10px 0 15px 0'>
        <div class="form-header" :style="{'border-color': color}">
            <div style="margin-left:10px;font-weight:bold;color:#464c5b;float:left;font-size:14px;">
                <slot name="name">{{name}}</slot>
            </div>
            <div style="margin-left:10px;font-weight:normal;color:#657180;float:left;font-size:12px;margin-top:2px;">
                <slot name="label">{{label}}</slot>
            </div>
        </div>
    </Row>
</div>
</template>

<script>

export default {
    name: 'formHeader',
    components: {
    },
    props: {
        name: String,
        label: String,
        color: {
            type: String,
            default: '#2d8cf0'
        },
    },
    data () {
        return {
            loading: false,
        };
    },
    watch: {
        query (v) {
            // this.ajaxData()
        }
    },
    created () {
    },
    mounted () {
    },
    methods: {
    },
    watch: {
    },
    init(){
    }
};
</script>
<style lang="less" scoped>
.form-header{
    border-left: 3px;
    border-left-style: solid;
    border-left-color: #2d8cf0;
    overflow:hidden;
}
</style>


