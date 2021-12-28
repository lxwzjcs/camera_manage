import axios from 'axios'
axios.defaults.withCredentials = true
import GL from '../components/Global'

export default function ajax(url, data = {}, type = 'Get') {
    return new Promise((resolve, reject) => {
        let promise
        if (type == 'Get') {
            let dataStr = ''
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + ' &'
            })
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            promise = axios.get(GL.baseUrl + url, { headers: { 'Content-Type': '	application/json' } })
        } else {
            promise = axios.post(GL.baseUrl + url, data, { headers: { 'Content-Type': '	application/json' } })
        }
        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })

}


