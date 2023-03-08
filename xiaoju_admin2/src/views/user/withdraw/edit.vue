<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'userWithdraw',
            items: [
                {label: '提现信息', desc: '提现的基本信息', type: 'header'},
                {label: '提现方式', name: 'account_type', value: 1, type: 'select', dropList:[
                    {value: 1, name: '银行'},
                    // {value: 2, name: '微信'},
                    // {value: 3, name: '支付宝'},
                ], rules: [{ required: true, trigger: 'blur', type: 'number' }]},
                {label: '提现月份', name: 'yearmonth', value: '', type: 'month', format: 'yyyy-MM', options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                }, onChange: this.monthChange.bind(this) },
                {label: '可提余额', name: 'balance', value: '', type: 'label'},
                {label: '手续费率', name: 'service_rate', value: '', type: 'label'},
                {label: '提现金额', name: 'fee', value: null, type: 'input', min: 1, rules: [{ required: false, trigger: 'blur', type: 'number' }]},
                {label: '提现姓名', name: 'account_realname', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '提现银行', name: 'account_name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '提现银行分行', name: 'branchbank_name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '提现账号', name: 'account_number', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '备注', name: 'remark', value: '',  type: 'textarea', },
            ],
            forms: {}
        }
    },
    computed: {
    },
    created () {
    },
    mounted () {
    },
    methods: {
        loadBalanceData (yearmonth) {
            // 查询余额
            let q = {}
            q.type = "balance";
            q.yearmonth = yearmonth || ''
            $utils.api.load('userQueryMonthMoney', q, 'get', { toast: false, toasterror: false, loading: false, login: false }).then((res) => {
                if(res && res.data){
                    // 余额
                    let data = res.data || {}
                    for (let index = 0; index < this.items.length; index++) {
                        const element = this.items[index];
                        if(element && element.name == 'balance') {
                            this.items[index].value = data.balance + '元'
                        }
                        if(element && element.name == 'fee') {
                            // this.items[index].min = data.balance
                            // this.items[index].max = data.balance
                            this.items[index].value = parseFloat(data.balance)
                            this.forms.fee = parseFloat(data.balance)
                            this.items[index].disabled = true
                            console.log('xxxx', this.items[index].value)
                        }
                    }
                    console.log('userMoney ', res.data)
                }
            })
            // 查询配置
            q = {}
            q.groups = "withdraw";
            $utils.api.load('siteConfig', q).then((res) => {
                if(res && res.data){
                    // 收款账号
                    let data = res.data || {}
                    for (let index = 0; index < this.items.length; index++) {
                        const element = this.items[index];
                        if(element && element.name == 'service_rate') {
                            if(data.withdraw_service_money_r) {
                                this.items[index].value = data.withdraw_service_money_r.value + '%'
                            }
                        }
                        if(element && element.name == 'fee') {
                            if(data.withdraw_low_money) {
                                // this.items[index].min = data.withdraw_low_money.value
                            }
                        }
                    }
                    console.log('siteConfig  withdraw', res.data)
                }
            })
        },
        monthChange (val) {
            console.log('monthChange', val)
            this.loadBalanceData(val)
        },
    }
}
</script>

