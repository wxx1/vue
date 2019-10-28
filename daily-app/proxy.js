const http = require('http')
const request = require('request')

const port = 3000
const imgPort = 3001

http
    .createServer((req, res) => {
        console.log('进入接口代理')
        const url = 'http://news-at.zhihu.com/api/4' + req.url
        const option = {
            url: url
        }
        request(option, (err, response, body) => {
            console.log('服务器发送请求',option.url)
            if (!err && response.statusCode === 200) {
                res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.end(body)
            }
        })
    })
    .listen(port, () => {
        console.log('接口代理运行在http://127.0.0.1:3000')
    })

http
    .createServer((req, res) => {
        console.log('进入图片代理')
        const url = req.url.split('/img/')[1]
        const options = {
            url: url,
            encoding: null
        }

        request(options, (err, response, body) => {
            console.log('请求地址',options.url)
            if (!err && response.statusCode === 200) {
                const contentType = response.headers['content-type']
                res.setHeader('Content-Type', contentType)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.end(body)
            }
        })
    })
    .listen(imgPort, () => {
        console.log('图片代理运行在12.0.0.1:3001')
    })