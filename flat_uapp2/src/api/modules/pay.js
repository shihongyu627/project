// initial state
const baseName = "/customer/pay";
const payBill = baseName + "/pay"; //支付接口：(id:账单ID,type 支付类型 ：0=支付宝(app)，1=微信小程序，2=微信app)
const accountPay = baseName + "/accountPay"; //支付接口：sourceId=数据源ID,type= 充值类型（water=水费，electric=电费 ），money=金额,payType=支付方式

export { payBill, accountPay };
