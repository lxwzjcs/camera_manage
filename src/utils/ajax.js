import axios from 'axios'

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
            promise = axios.get(url)
        } else {
            promise = axios.post(url, data)
        }
        promise.then(res => {
            resolve(res)
        }).catch(err => {
                reject(err)
            })
    })

}


