<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
    extends: baseInfo,
    components: {
    },
    data () {
        return {
            mname: 'banner',
            items: [
                {label: '基本信息', desc: '', type: 'header'},
                {label: '标题', name: 'title', value: '', type: 'label', },
                {label: '位置', name: 'place', value: 'home_banner', type: 'label', },
                {label: '封面图', name: 'image', value: '',  type: 'image', },
                {label: '超链接', name: 'linkurl', value: '',  type: 'label', },
                {label: '内容', name: 'content', value: '',  type: 'label', },
            ],
            info: {},
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
