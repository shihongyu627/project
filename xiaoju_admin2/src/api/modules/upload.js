// initial state
import * as base from './base.js'
const uploadName = '/admin/api/upload'
const qrcodeName = '/admin/api/qrcode'

const uploadFile = uploadName + '/uploadFile'
const uploadImage = uploadName + '/uploadImage'
const uploadDesign = uploadName + '/uploadDesign'
const uploadDocument = uploadName + '/uploadDocument'
const uploadToken = uploadName + '/uploadToken'

const qrcode = qrcodeName + '/qrcode'

const obj = base.setBaseUrl('upload', uploadName)
const a = Object.assign({uploadFile, uploadImage, uploadDesign,  uploadDocument, uploadToken , qrcode}, obj)
export default a
