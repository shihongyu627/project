<template>
<div style="">
    <Card class="card-box"  :padding="0" @click.native="toUrl(url)" style="border: 0px solid #efefef;">
        <div class="PartIcon" :style="{background: color}">
            <Icon :type="icon" :color="'#fff'" :size="26" style="line-height: 40px;"/>
        </div>
        <div class="PartWord">
            <div class="itemName">
                {{name}}<span class="newIcon" v-if="hot" >{{hot}}</span>
            </div>
            <div class="itemSubName">{{label}}</div>
        </div>
    </Card>
</div>
</template>

<script>

export default {
    name: 'cardBox',
    components: {
    },
    props: {
        name: String,
        label: String,
        url: String,
        icon: {
            type: String,
            default: 'checkmark'
        },
        color: {
            type: String,
            default: '#2d8cf0'
        },
        hot: {
            type: String,
            default: ''
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
        toUrl(url) {
            return $utils.url.push({name:url})
        }
    },
    watch: {
    },
    init(){
    }
};
</script>
<style lang="less" scoped>
.card-box{
    float: left;
	width: 235px;
	height: 80px;
	margin-top: 10px;
	margin-bottom: 10px;
	box-sizing: border-box;
	background-color: #f9f9f9;
	transition: .2s all ease;
	cursor: pointer;
	margin-right: 20px;
	position: relative;
    margin-left: 0!important;
    
    .PartIcon{
        width: 40px;
	    height: 40px;
	    margin: 20px 0 20px 20px;
        float: left;
        text-align: center;
        border-radius: 5px;
    }
    .PartWord{	
        position: relative;
	    margin: 20px 0 20px 10px;
	    display: inline-block;
        color: #353535;
        .itemSubName {
            margin-top: 3px;
        	font-size: 12px;
        	color: #888;
        }
        .newIcon {
            width: 34px;
            line-height: 16px;
            padding: 0 4px;
            margin-left: 5px;
            font-size: 12px;
            color: #fff;
            background-color: #fb6161;
            border-radius: 8px;
            text-align: center;
        }
    }
}
</style>


