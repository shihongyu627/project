const isPhoneNumber = {
  // 判断手机号是否正确
  isAvailable: function(val) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(val)) {
      return false;
    } else {
      return true;
    }
  }
};
export default isPhoneNumber;
