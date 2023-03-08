import ShopEdit from "./edit.vue";
import ShopList from './list.vue'
import * as ShopAccount from './account'
import * as ShopAccountRecords from './account/records'
import * as ShopStore from './store'
import * as ShopStoreFee from './store/fee'
import * as ShopStoreArea from './store/area'
import * as ShopStoreTime from './store/time'
import * as ShopStoreTag from './store/tag'
let a = Object.assign({ShopEdit, ShopList}, ShopAccount, ShopAccountRecords, ShopStore, ShopStoreFee, ShopStoreArea, ShopStoreTime, ShopStoreTag)
export default a;
