import ShorturlEdit from "./shorturl/edit.vue";
import ShorturlList from "./shorturl/list.vue";
import QrcodeRender from "./qrcode/render.vue";
import UploadList from "./upload/list.vue";
let a = Object.assign({ShorturlEdit, ShorturlList}, {QrcodeRender}, {UploadList})
export default a;
