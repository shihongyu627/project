// initial state
import * as base from './base.js'
const baseName = '/admin/api/feedback'

const feedbackReply = baseName + '/reply'

const obj = base.setBaseUrl('feedback', baseName)
const a = Object.assign(obj, {feedbackReply})
export default a
