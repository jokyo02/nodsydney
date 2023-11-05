// 引入必要的模块
const uWebSockets = require('uWebSockets.js');
const {
  UWSProxy,
  createUWSConfig
} = require('uws-reverse-proxy');

// 使用process.env.PORT变量来获取Render分配的端口
const port = process.env.PORT || 80;

// 创建一个反向代理，将请求转发到https://sydney.bing.com
const proxy = new UWSProxy(
  createUWSConfig(
    uWebSockets,
    { port }
  )
);

// 启动反向代理
proxy.start();

// 设置反向代理的目标地址为https://sydney.bing.com
proxy.setTarget('https://sydney.bing.com');
