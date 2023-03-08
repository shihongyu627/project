<template>
<Row >
    <Col style="max-width:550px;">
        <div id="mapcontainer" :style="{height:config.height+'px'}"></div>
    </Col>
</Row>
</template>

<script>
export default {
    name: 'formMap',
    components: {
    },
    props: { 
        value: {
            type: String,
            default: ''
        },
        config: {
            type: String,
            default: () => {
                return {
                    height: 220,
                }
            },
        },
    },
    data () {
        return {
            amap: null,
            lnglat: '',
            address: ''
        };
    },
    computed: {
    },
    created () {
    },
    mounted() {
      this.loadMap()
    },
    methods: {
        loadMap () {
            let _this = this
            window.onLoad  = () => {
                _this.amap = new AMap.Map('mapcontainer');
                AMap.plugin('AMap.ToolBar',function(){//异步加载插件
                    let toolbar = new AMap.ToolBar();
                    _this.amap.addControl(toolbar);
                });
                AMap.plugin('AMap.Geocoder', function() {
                  _this.geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: '010'
                  })
                  _this.amap.addControl(geocoder);
                  
                })
                _this.amap.on('click',(e)=>{
                    _this.lnglat = e.lnglat
                    console.log('lnglat', e.lnglat)
                    _this.$emit('setLngLat', e.lnglat.lng+','+e.lnglat.lat)
                    _this.getAddress();
                })
            }
            let url = 'https://webapi.amap.com/maps?v=1.4.14&key=728738a7d077c8125905b04e7eb28715&callback=onLoad';
            let jsapi = document.createElement('script');
            jsapi.charset = 'utf-8';
            jsapi.src = url;
            document.head.appendChild(jsapi);
        },
        getAddress () {
            let _this = this
            if(!this.marker){
                this.marker = new AMap.Marker();
                this.amap.add(this.marker);
            }
            this.marker.setPosition(this.lnglat)
            this.geocoder.getAddress(this.lnglat, function(status, result) {
              console.log(result)
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                _this.address = result.regeocode.formattedAddress
                _this.$emit('setAddress', _this.address)
              }
            })
        }
    },
    destroyed() {
    },
    updated () {
    },
    watch: {
        value (val) {
            if (!this.isinit && val) {
                this.isinit = true
                
            }
        }
    },
    init(){
    }
};
</script>
<style lang="less">
</style>


