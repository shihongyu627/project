import { Button, Image } from "@tarojs/components";
import bookSearch from "@assets/image/bookSearch.png";
import Taro from "@tarojs/taro";
export default {
  navigationBarTitleText: "通讯录",
  usingComponents: {},
  enablePullDownRefresh: true,
  rn: {
    screenOptions: {
      headerRight: () => (
        <Image
          style={{ width: 20, height: 20, marginRight: 20 }}
          src={bookSearch}
          mode="aspectFill"
          onClick={() => {
            Taro.eventCenter.trigger("refreshSearch", true);
          }}
        />
      )
    }
  }
};
