<template>
<div >
    <Row class="margin-top-20 publish-button-con" style="background:#fff;">
        <FormItem>
            <slot>
            </slot>
        </FormItem>
    </Row>
</div>
</template>

<script>

export default {
    name: 'buttonBox',
    components: {
    },
    props: {
        name: String,
        label: String,
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
<style lang="less">

</style>


