import UserEdit from "./edit.vue";
import UserList from './list.vue'
import UserEditPassword from "./edit/password.vue";
import * as UserAccountRecords from './account/records'
import * as UserReal from './real'
import * as UserWithdraw from './withdraw'
import UserBlack from './black'
import UserWhite from './white'
let a = Object.assign({UserEdit, UserList, UserEditPassword}, UserAccountRecords, UserReal, UserWithdraw, UserBlack, UserWhite)
export default a;
