<template>
<Poptip v-model="visible">
    <Icon type="md-git-merge" color="#f60" @click="onClick" v-if="info"/>
    <div slot="title">渠道编码：{{info && info.code}}</div>
    <div slot="title">渠道名称：{{info && info.name}}</div>
    <div slot="title">渠道备注：{{info && info.remarks}}</div>
    <div slot="title"></div>
    <div slot="title">[{{info && info.user && info.user.uid}}]  {{info && info.user && info.user.uname}} <Avatar style="background-color: #87d068" :src="info && info.user && info.user.avatar" /></div>
</Poptip>
</template>

<script>

export default {
    name: 'popChannel',
    components: {
    },
    props: {
        info: Object
    },
    data () {
        return {
            visible: false
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
            this.visible = true
        }
    },
    watch: {
    }
};
</script>
<style lang="less">

</style>


