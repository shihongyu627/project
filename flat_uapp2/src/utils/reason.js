import Taro, { getCurrentInstance } from "@tarojs/taro";
// 积分推送

// 积分推送
function pointUp(data) {
  return new Promise((resolve, reject) => {
    // loading
    let d = {};
    d = data;
    console.log(d, "xxxx");
    $utils.api
      .load("updatePersonIntegral", d, "post", false)
      .then((res) => {
        console.log(res, "推送积分");
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
  });
}
const reason = {
  pointUp: pointUp,
};
export default reason;

