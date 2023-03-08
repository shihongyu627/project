<template>
<div style="">
    <base-sum ref="base" :title="title" :info="tip" :value="info.view_sum_count" :label="label" :label1="info.view_day_count">
    </base-sum>
</div>
</template>
<script>
import Cookies from 'js-cookie';
import baseSum from './baseSum';
import echarts from 'echarts';
export default {
    data () {
        return {
            title: '访问量',
            tip: '指标说明',
            value: '0',
            label: '日访问量',
            label1: '0',
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
    computed: {
        get_num1 () {
            return Cookies.get('num1') || 0;
        },
        get_num2 () {
            return Cookies.get('num2') || 0;
        }

    },
    mounted () {
        let num1 = parseInt(Cookies.get('num1')) || 0
        let num2 = parseInt(Cookies.get('num2')) || 3
        Cookies.set('num1', num1+1);
        Cookies.set('num2', num2+1);
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
                        ['ios', 0],
                        ['android', 0],
                        ['pc', 0],
                        ['web', 0],
                        ['others', 0]
                    ]
                },
                xAxis: [{type: 'category',show: false}],
                // 声明一个 Y 轴，数值轴。
                yAxis: [{type: 'value',show: false}],
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'bar',
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
