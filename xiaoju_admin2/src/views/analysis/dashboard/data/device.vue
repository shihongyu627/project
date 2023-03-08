<script>
import base from './base';
import echarts from 'echarts';

export default {
    name: 'trend',
    extends: base,
    data () {
        return {
            //
        };
    },
    props: {
        title: {
            type: String,
            default: '车辆分布图'
        },
    },
    mounted () {
        this.$nextTick(() => {
            this.chart = echarts.init(document.getElementById(this.uuid), 'light');
            const option = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left:'right'
                },
                dataset: {
                    // 提供一份数据。
                    source: [
                        ['value', 'value'],
                        ['ios', 2],
                        ['android', 4],
                        ['pc', 0],
                        ['web', 0],
                        ['others', 0]
                    ]
                },
                // xAxis: {},
                // 声明一个 Y 轴，数值轴。
                // yAxis: {},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [
                    {type: 'pie'}
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
