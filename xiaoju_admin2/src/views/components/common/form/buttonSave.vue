<template>
<span>
    <Button :icon="icon" style="margin-left: 8px;width:90px;" type="primary" @click="onClick">
        <slot>
        {{label}}
        </slot>
    </Button>
</span>
</template>

<script>

export default {
    name: 'buttonSave',
    components: {
    },
    props: {
        label: {
            type: String,
            default: '保存'
        },
        icon: {
            type: String,
            default: 'ios-checkmark-circle'
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


