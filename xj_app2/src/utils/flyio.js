import Taro from '@tarojs/taro'
import Fly from "flyio/dist/npm/wx"
import qs from  'qs'
//定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
//设置超时
// fly.config.timeout=10000;
//设置请求基地址
// fly.config.baseURL="https://wendux.github.io/"


// var csrfToken="";
// var tokenFly=new Fly();
const fly = new Fly();

/** 添加请求拦截器
 * 请求拦截器中的request对象结构
 {
  baseURL,  //请求的基地址
  body, //请求的参数
  headers, //自定义的请求头
  method, // 请求方法
  timeout, //本次请求的超时时间
  url, // 本次请求的地址
  params, //url get参数(post请求或默认的get参数)    
  withCredentials, //跨域请求是否发送第三方cookie
  ... //options中自定义的属性
}
 * 
 */
// fly.interceptors.request.use((request)=>{
//     // console.log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`)
//     // if (!csrfToken) {
//     //     console.log("没有token，先请求token...");
//     //   //锁定当天实例，后续请求会在拦截器外排队
//     //   fly.lock();
//     //   return tokenFly.get("/token").then((d) => {
//     //     request.headers["csrfToken"] = csrfToken = d.data.data.token;
//     //     console.log("token请求成功，值为: " + d.data.data.token);
//     //     console.log(`继续完成请求：path:${request.url}，baseURL:${request.baseURL}`)
//     //     return request; //只有最终返回request对象时，原来的请求才会继续
//     //   }).finally(()=>{
//     //     //fly.clear(); //clear the request queue
//     //     fly.unlock();//解锁后，会继续发起请求队列中的任务
//     //   }) 
//     // } else {
//     //   request.headers["csrfToken"] = csrfToken;
//     // }
//   	//终止请求
//   	//var err=new Error("xxx")
//   	//err.request=request
//   	//return Promise.reject(new Error(""))
  
//     //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
//     return request;
// })

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
/**
 *响应拦截器中的response对象结构
{
  data, //服务器返回的数据
  engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
  headers, //响应头信息
  request  //本次响应对应的请求信息，即上面的request结构
}
 */
fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        return response.data
    },
    (err) => {
        //发生网络错误后会走到这里
        //return Promise.resolve("ssss")
    }
)

// 移除拦截器
// fly.interceptors.request.use(null)
// fly.interceptors.response.use(null,null)

export default class http {
    static get (url,params,options){
        return new Promise((resolve,reject)=>{
            fly.get(url,params,{...options})
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    static post (url,params,options){
        return new Promise((resolve,reject)=>{
            fly.post(url,qs.stringify(params),{...options})
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    static put (url,params,options){
        return new Promise((resolve,reject)=>{
            fly.put(url,params,{...options})
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    static delete (url,params,options){
        return new Promise((resolve,reject)=>{
            fly.delete(url,params,{...options})
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    
}