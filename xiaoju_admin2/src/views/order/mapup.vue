<template>
  <div style="width:100%;height:400px">
    <div id="mapcontainer" style="height:400px;width:100%;"></div>
    <div class="input-item">
      <input id="clear" type="button" class="btn" value="清除" />
      <input id="close" type="button" class="btn" value="提交" />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      amap: null,
      infoWindow: null,
      searchArr: [],
      lnglatArr: [],
    };
  },
  created() {
    let query = this.$route.query;
    console.log("xxxx", query);
    let e_lnglat = "";
    if (query.e_lnglat) {
      e_lnglat = query.e_lnglat.split(",").reverse();
    }
    let s_lnglat = "";
    if (query.s_lnglat) {
      s_lnglat = query.s_lnglat.split(",").reverse();
    }
    console.log(s_lnglat, e_lnglat);

    this.loadMap(s_lnglat, e_lnglat);
  },
  mounted() {},
  methods: {
    upLocation(lnglatArr) {
      console.log(lnglatArr, "提交");
      if (lnglatArr.length > 0) {
        for (let index = 0; index < lnglatArr.length; index++) {
          //   lnglatArr[index];
          let q = {};
          q.device_id = this.$route.query.device_id;
          q.order_id = this.$route.query.order_id;
          q.lat = lnglatArr[index].split(",")[0];
          q.lng = lnglatArr[index].split(",")[1];
          setTimeout(() => {
            console.log($utils.time.now());
            $utils.api
              .load("mapUpLocation", q)
              .then((res) => {
                console.log(res);
                $utils.toast.text(res.message);
              })
              .catch((e) => {
                console.log(e);
                $utils.toast.error("数据异常");
              });
          }, index * 1000);
        }
        // lnglatArr.map((item) => {
        //   console.log(item.split(","));
        // });
      }
    },
    loadMap(s_lnglat, e_lnglat) {
      let _this = this;
      window.onLoad = () => {
        _this.amap = new AMap.Map("mapcontainer");

        // 将 icon 传入 marker
        if (s_lnglat) {
          var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(48, 48),
            // 图标的取图地址
            image: require("../../assets/icon/icon_start.png"),
            // 图标所用图片大小
            imageSize: new AMap.Size(48, 48),
            // 图标取图偏移量
            // imageOffset: new AMap.Pixel(-24, -24),
          });
          var startMarker = new AMap.Marker({
            position: new AMap.LngLat(s_lnglat[1], s_lnglat[0]),
            icon: startIcon,
            offset: new AMap.Pixel(-24, -48),
          });
          _this.amap.add([startMarker]);
        }

        if (e_lnglat) {
          // 创建一个 icon
          var endIcon = new AMap.Icon({
            size: new AMap.Size(48, 48),
            image: require("../../assets/icon/icon_end.png"),
            imageSize: new AMap.Size(48, 48),
            // imageOffset: new AMap.Pixel(-24, -24),
          });

          // 将 icon 传入 marker
          var endMarker = new AMap.Marker({
            position: new AMap.LngLat(e_lnglat[1], e_lnglat[0]),
            icon: endIcon,
            offset: new AMap.Pixel(-24, -48),
          });
          _this.amap.add([endMarker]);
        }

        // 将 markers 添加到地图

        var mouseTool = new AMap.MouseTool(_this.amap);
        //监听draw事件可获取画好的覆盖物
        var overlays = [];
        mouseTool.on("draw", function(e) {
          console.log(e.obj, "xxxx");
          overlays.push(e.obj);
        });
        //为地图注册click事件获取鼠标点击出的经纬度坐标
        let lnglatArr = [];
        var clickEventListener = _this.amap.on("click", function(e) {
          let value = e.lnglat.getLng() + "," + e.lnglat.getLat();
          console.log(value);
          return lnglatArr.push(value);
        });

        function draw(type) {
          switch (type) {
            case "marker": {
              mouseTool.marker({
                //同Marker的Option设置
              });
              break;
            }
          }
        }
        var radios = document.getElementsByName("func");
        for (var i = 0; i < radios.length; i += 1) {
          radios[i].onchange = function(e) {
            draw(e.target.value);
          };
        }
        draw("marker");

        document.getElementById("clear").onclick = function() {
          _this.amap.remove(overlays);
          overlays = [];
          console.log("awwww", lnglatArr);
        };
        document.getElementById("close").onclick = function() {
          mouseTool.close(true); //关闭，并清除覆盖物
          console.log("awwww", lnglatArr);
          for (var i = 0; i < radios.length; i += 1) {
            radios[i].checked = false;
          }
          _this.upLocation(lnglatArr);
        };

        AMap.plugin("AMap.ToolBar", function() {
          //异步加载插件
          let toolbar = new AMap.ToolBar();
          _this.amap.addControl(toolbar);
        });
        // AMap.plugin("AMap.Geocoder", function() {
        //   _this.geocoder = new AMap.Geocoder({
        //     // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        //     // city: '010'
        //   });
        //   _this.amap.addControl(geocoder);
        // });
        AMap.plugin("AMap.OverView", function() {
          let OverView = new AMap.OverView();
          _this.amap.addControl(OverView);
        });
        AMap.plugin("AMap.MapType", function() {
          let MapType = new AMap.MapType();
          _this.amap.addControl(MapType);
        });
        AMap.plugin("AMap.Geolocation", function() {
          let Geolocation = new AMap.Geolocation();
          _this.amap.addControl(Geolocation);
        });
        AMap.plugin("AMap.ElasticMarker", function() {
          let ElasticMarker = new AMap.ElasticMarker();
          _this.amap.addControl(ElasticMarker);
        });
        AMap.plugin("AMap.RangingTool", function() {
          let RangingTool = new AMap.RangingTool(_this.amap);
          _this.amap.addControl(RangingTool);
        });
        // 加载锚点
        _this.loadMarker();
      };
      let url =
        "https://webapi.amap.com/maps?v=1.4.14&key=74b2753eb3294de148b0ef3dca8a8a14&callback=onLoad&plugin=AMap.MouseTool";
      let jsapi = document.createElement("script");
      jsapi.charset = "utf-8";
      jsapi.src = url;
      document.head.appendChild(jsapi);
    },
    loadMarker() {
      let _this = this;
      // 加载锚点
      var lnglats = this.searchArr;

      var infoWindow = new AMap.InfoWindow({
        isCustom: true,
        offset: new AMap.Pixel(0, -30),
      });
      for (var i = 0, marker; i < lnglats.length; i++) {
        var marker = new AMap.Marker({
          position: lnglats[i],
          icon: require("../../assets/icon/icon_map2.png"),
          map: _this.amap,
        });
        // marker.content = contents[i].join('<br/>')
        marker.on("click", (e) => {
          console.log(e);
          infoWindow.setContent(e.target.content);
          infoWindow.open(_this.amap, e.target.getPosition());
        });
      }
      _this.amap.setFitView();
    },
  },
};
</script>
<style lang="less" scoped></style>
