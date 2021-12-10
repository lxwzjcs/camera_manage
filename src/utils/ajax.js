import axios from 'axios'
axios.defaults.withCredentials = true

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
            promise = axios.get('http://192.168.1.218:8080'+url,{headers:{'Content-Type':'	application/json'}})
        } else {
            promise = axios.post('http://192.168.1.218:8080'+url, data,{headers:{'Content-Type':'	application/json'}})
        }
        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
                reject(err)
            })
    })

}


