import { Button, Image } from "@tarojs/components";
import gradedownload from "@assets/image/gradedownload.png";
import Taro from "@tarojs/taro";
export default {
  navigationBarTitleText: " ",
  usingComponents: {},
  navigationBarBackgroundColor: "#ffffff",
  enablePullDownRefresh: true,
  rn: {
    screenOptions: {
      headerRight: () => (
        <Image
          style={{ width: 20, height: 20, marginRight: 20 }}
          src={gradedownload}
          mode="aspectFill"
          onClick={() => {
            Taro.eventCenter.trigger("refreshMonthDownloadList", true);
          }}
        />
      )
    }
  }
};
