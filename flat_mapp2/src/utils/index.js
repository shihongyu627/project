// import dayjs from "dayjs";
import data from "./data";
import datetime from './datetime';
// import jumpUrl from "./jumpUrl";
// import appconfig from './appconfig'
import loadimg from "./loadimg";
import loading from "./loading";
// import location from './location';
import app from './app'
import auth from './auth'
// import pay from './pay';
// import device from './device'
// import network from './network'
import api from "../api";
// import storage from "./storage";
import toast from "./toast";
// import reason from "./reason";
// import qrcode from "./qrcode";
import share from "./share";
import file from "./file";
import permission from "./permission";
import isPhoneNumber from "./isPhoneNumber";
import push from "./push";
// import numForamt from "./numFormat"

// 注入方法
const utils = {
  // jumpUrl,
  // storage,
  // appconfig,
  loadimg,
  datetime,
  // location,
  toast,
  loading,
  data,
  app,
  auth,
  // pay,
  // device,
  // network,
  api,
  // dayjs,
  // numForamt,
  // reason,
  // qrcode,
  share,
  file,
  permission,
  isPhoneNumber,
  push
};

export default utils;
