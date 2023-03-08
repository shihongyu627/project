<template>
    <div style="">
        <Modal v-model="show" width="480" :draggable="true" @on-cancel="handleCancel" @on-visible-change="handleChange">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="md-information-circled"></Icon>
                <span>{{title}}</span>
            </p>
            <div style="text-align:center">
                <p></p>
                <div id="letv_video" ></div>
                <br />
                <p>letv_vu: {{vu}}</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="play">立即播放</Button>
            </div>
        </Modal>
    </div>
</template>
<!--乐视云视频-->
<script>
    export default {
        name: 'playVideo',
        props: {
            title: String,
            vu: String,
            value: Boolean
        },
        data() {
            return {
                show: false,
                player: null
            };
        },
        created() {
        },
        watch: {
            value (val) {
                this.show = val
            }
        },
        methods: {
            play () {
                this.player.sdk.startUp();
            },
            handleCancel () {
                console.log('play close')
                this.player.sdk.shutDown();
                this.$emit('input', false)
            },
            handleChange () {
                if (this.value) {
                    // 播放初始化
                    let d_w = "100%";
                    let d_h = "100%";
                    let playerConf = {
                        "callbackJs": "call",
                        "uu": "82b17779a0",
                        "vu": "",
                        "pu": "3398D31776",
                        "auto_play": 0,
                        "gpcflag": 1,
                        "type": "video"
                    };
                    playerConf.vu = this.vu;
                    playerConf.width = d_w;
                    playerConf.height = d_h;
                    playerConf.autoSize=1; //依据高度
                    //播放器初始化
                    this.player = $utils.player.CloudVodPlayer()
                    this.player.init(playerConf, 'letv_video');
                    console.log('play init')
                }
            }
        }
    };
</script>