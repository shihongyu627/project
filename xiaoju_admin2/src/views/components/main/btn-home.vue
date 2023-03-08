<template>
    <div @click="toHome" class="message-con">
        <Tooltip content="首页" placement="bottom">
            <Icon type="ios-home" :size="21"></Icon>
        </Tooltip>
    </div>
</template>

<script>
export default {
    name: 'btnHome',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    methods: {
        toHome () {
            window.open('/','_blank')
        }
    }
};
</script>
