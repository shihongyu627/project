import OrderList from './list.vue'
import OrderSimple from './simple.vue'
import OrderMapUp from './mapup.vue'
import OrderRefund from './refund.vue'
import * as OrderStatus from './status'
let a = Object.assign({OrderList,OrderSimple,OrderMapUp,OrderRefund}, OrderStatus)
export default a;
