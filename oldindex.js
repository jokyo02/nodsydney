// 引入必要的模块
const express = require('express');
const uwsReverseProxy = require('uws-reverse-proxy');

// 创建一个 Express 应用
const app = express();

// 设置端口
const PORT = process.env.PORT || 3000; // Render 会提供环境变量 PORT

// 创建一个反向代理，将请求转发到 https://sydney.bing.com
const proxy = uwsReverseProxy.createServer({ target: 'https://sydney.bing.com' });

// 定义一个简单的路由来响应 GET 请求
app.get('/', (req, res) => {
  res.send('Hello from Render deployed proxy!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  // 将反向代理绑定到 Express 应用的端口
  proxy.bind(app);
});
