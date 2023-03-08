export default  function numFormat(val){
    if( typeof val != 'number' ){
        throw Error('参数类型错误')
    }else{
        if(val >= 10000){
            val = (val%1000) > 0  ?parseInt(val/1000) +'k+': parseInt(val/1000) + "k"
        }
        return val
    }

}