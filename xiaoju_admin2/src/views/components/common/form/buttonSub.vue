<template>
<span>
    <Button :loading="loading" :icon="icon" style="width:90px;" type="primary" @click="onClick">
        <slot>
        {{label}}
        </slot>
    </Button>
</span>
</template>

<script>

export default {
    name: 'buttonSub',
    components: {
    },
    props: {
        label: {
            type: String,
            default: '提交'
        },
        icon: {
            type: String,
            default: 'ios-checkmark-circle'
        },
        loading: {
            type: Boolean,
            default: false
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


