//服务器ip
const baseUrl = "http://192.168.1.218:8080"

//任务类型
const type=['杂物检测','烟雾检测','奔跑检测','人头检测','进出检测','火焰检测','斗殴检测','跌倒检测']

//显卡号
const gpu=['0','1']

//采样间隔
const dropFrameInterval=['0','5','10','15','20']

export default {
    baseUrl,
    type,
    gpu,
    dropFrameInterval
}

