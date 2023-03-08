<template>
<span>
    <Button type="default" style="margin-left: 8px" @click="goBack">
        <slot>
        {{label}}
        </slot>
    </Button>
</span>
</template>

<script>

export default {
    name: 'buttonBack',
    components: {
    },
    props: {
        label: {
            type: String,
            default: '取消'
        },
    },
    data () {
        return {
            loading: false,
        };
    },
    watch: {
    },
    created () {
    },
    mounted () {
    },
    methods: {
        goBack() {
            return $utils.url.go(-1)
        }
    },
    watch: {
    }
};
</script>
<style lang="less">

</style>


