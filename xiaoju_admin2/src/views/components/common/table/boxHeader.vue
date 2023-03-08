<template>
<Row style='margin:20px 0'>
    <div style="float:left;text-align:left;">
        <slot name="left" ></slot>
    </div>
    <div style="float:right;text-align:left;">
        <slot name="right" ></slot>
    </div>
</Row>
</template>

<script>

export default {
    name: 'boxHeader',
    components: {
    },
    props: {
        name: String,
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
    }
};
</script>
<style lang="less">

</style>


