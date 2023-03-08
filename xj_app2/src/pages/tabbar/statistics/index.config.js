import { Button, Image } from "@tarojs/components";
import change from "@assets/image/change.png";
import Taro from "@tarojs/taro";
export default {
  navigationBarTitleText: "隐患统计",
  usingComponents: {},
  enablePullDownRefresh: true,
  rn: {
    screenOptions: {
      headerRight: () => (
        <Image
          style={{ width: 20, height: 20, marginRight: 20 }}
          src={change}
          mode="aspectFill"
          onClick={() => {
            Taro.eventCenter.trigger("refreshStatisticsSearch", true);
          }}
        />
      )
    }
  }
};
