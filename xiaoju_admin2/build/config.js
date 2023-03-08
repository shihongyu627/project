import Env from './env';
import Host from './host';
const baseurl = '//xiaoju.idocore.com'
const baseurls = '//xiaoju.idocore.com'

const host_dev = baseurl
const host_online = baseurls
const qiniu = 'http://img.static.idocore.com'

let apihost = ''
if (Env === 'production') {
    let IHOST = Host;  // dev online
    if(IHOST == 'online'){
        apihost = host_online  // online生产地址
    } else {
        apihost = host_dev  // dev开发地址
    }
    console.log('HOST ', apihost)
} else {
    apihost = host_dev
}


let config = {
    env: Env,
    API_HOST: apihost,
    IMAGE_HOST: qiniu,
};
export default config;
