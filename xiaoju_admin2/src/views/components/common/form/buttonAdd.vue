<template>
<span>
    <Button type="primary" icon="md-add"  @click="onClick">
        <slot>
        新增
        </slot>
    </Button>
</span>
</template>

<script>

export default {
    name: 'buttonAdd',
    components: {
    },
    props: {
        label: {
            type: String,
            default: '新增'
        },
    },
    data () {
        return {
        };
    },
    watch: {
    },
    created () {
    },
    mounted () {
    },
    methods: {
        onClick() {
            this.$emit('click')
        }
    },
    watch: {
    }
};
</script>
<style lang="less">

</style>


