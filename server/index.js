const express = require("express")
const webpack = require("webpack")
const opn = require('opn')
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-hot-middleware")
const webpackConfig = require('../webpack.config.js')
const compress = require('compression')
const app = express()
const port = 8080
const compiler = webpack(webpackConfig)
const project = require('../project.config')
const proxy = require('http-proxy-middleware');
//将服务器代理到localhost:8080端口上[本地服务器为localhost:3000]
const apiProxy = proxy('/api', { target: 'http://localhost:9999',changeOrigin: true });
const wechatProxy = proxy('/wechat', { target: 'http://localhost:9999',changeOrigin: true });
const followProxy = proxy('/customer', { target: 'http://localhost:9999',changeOrigin: true });
app.use(compress())

const devMiddleware = webpackDevMiddleware(compiler, {
    quiet   : false,
    noInfo  : false,
    lazy    : false,
    headers : {'Access-Control-Allow-Origin': '*'},
    stats   : 'errors-only',
})

devMiddleware.waitUntilValid(()=>{
    opn("http://localhost:"+ port)
})

const hotMiddleware = webpackHotMiddleware(compiler, {
    path : '/__webpack_hmr',
    log  : false
})

app.use(devMiddleware)
app.use(hotMiddleware)
app.use('/api/*', apiProxy);//api子目录下的都是用代理
app.use('/wechat/*', wechatProxy);
app.use('/customer/*', followProxy);
app.use(hotMiddleware)
app.use(express.static(project.basePath))

module.exports = {
    app,
    port
}