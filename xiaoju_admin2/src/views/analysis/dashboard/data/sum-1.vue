<template>
<div style="">
    <base-sum ref="base" :title="title" :info="tip" :value="info.pay_sum_money" :label="label" :label1="info.pay_day_money">
    </base-sum>
</div>
</template>
<script>
import baseSum from './baseSum';
import echarts from 'echarts';
export default {
    data () {
        return {
            title: '总订单金额',
            tip: '指标说明',
            value: '￥0',
            label: '今日订单额',
            label1: '￥0',
        };
    },
    props: {
        info: {
            type: Object,
            default: () => {
              return {
              }
            }
        }
    },
    components: {
        baseSum
    },
    mounted () {
        this.$nextTick(() => {
            this.chart = echarts.init(document.getElementById(this.$refs.base.uuid), 'light');
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c}'
                },
                dataset: {
                    // 提供一份数据。
                    source: [
                        ['type', 'PV'],
                        ['ios', 2],
                        ['android', 4],
                        ['pc', 0],
                        ['web', 798403],
                        ['others', 0]
                    ]
                },
                xAxis: [{type: 'category',show: false}],
                // 声明一个 Y 轴，数值轴。
                yAxis: [{type: 'value',show: false}],
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'line',
                     smooth: true,
                     areaStyle: {},
                     clipOverflow: false}
                ],
            };
            this.chart.setOption(option);
            window.addEventListener('resize', () => {
                this.chart.resize();
            });
        });
    },
    methods: {
        initData () {
            // c
        }
    }
};
</script>
<style lang="less" scoped>
</style>
