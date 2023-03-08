<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
    extends: baseInfo,
    components: {
    },
    data () {
        return {
            mname: 'feedback',
            items: [
                {label: '基本信息', desc: '', type: 'header'},
                {label: '标题', name: 'title', value: '', type: 'label', },
                {label: '反馈内容', name: 'content', value: '', type: 'label', },
                {label: '反馈截图', name: 'gallery', value: '',  type: 'image', },
                {label: '回复信息', desc: '', type: 'header'},
                {label: '时间轴', name: 'reply_list', value: '', type: 'timeline',},
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
