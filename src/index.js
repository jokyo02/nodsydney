//const _U = '1NssJY8JoQgpNNg8fXA66mbbkV5Ev0YAin-YBPurJ69Zsa0gQ-Bq6eINo9NBQ7tam-OM4pykcZqsteI91B6BNM2AgD1XLp8Xy_yL34R2xDEGsb1V-lpIysooyQOlfECAtk_VJRtKUUWLXOI2TLVpfsrqcQhPGF56o56yge4LI11oy7q3K2v2zRSe6c6kpwP6bwtGVJF6cNtmxgzaf0UTEuw; WLS=C=4f32388253816ce8&N=cf03';//cf03

// 导入express模块
const express = require('express');
// 创建一个express应用
const app = express();

// 设置跨域访问的中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    // 如果是预检请求，直接返回200
    res.sendStatus(200);
  } else {
    // 否则继续下一个中间件
    next();
  }
});

// 处理WebSocket请求的中间件
app.use((req, res, next) => {
  const upgradeHeader = req.headers['upgrade'];
  if (upgradeHeader === 'websocket') {
    // 如果是WebSocket请求，调用handleWebSocket函数
    handleWebSocket(req, res);
  } else {
    // 否则继续下一个中间件
    next();
  }
});

// 处理WebSocket请求的函数
async function handleWebSocket(req, res) {
  // 如果需要，可以将serverUrl替换为您的服务器地址
  let serverUrl = "https://sydney.bing.com";
  // let fetchUrl = new URL(request.url);
  // fetchUrl.hostname = serverUrl;

  const currentUrl = new URL(req.url);
  const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);

  let serverRequest = new Request(fetchUrl, req);
  // serverRequest.headers.set('Host', 'sydney.bing.com');
  serverRequest.headers.set('origin', 'https://www.bing.com');
  serverRequest.headers.set('referer', 'https://www.bing.com/search?q=Bing+AI');

  const cookie = serverRequest.headers.get('Cookie') || '';
  let cookies = cookie;
  if (!cookie.includes('_U=')) {
    cookies += '; _U=' + '';
  }

  serverRequest.headers.set('Cookie', cookies);

  const response = await fetch(serverRequest);
  const newRes = new Response(response.body, response);

  //newRes.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
  newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newRes.headers.set('Access-Control-Allow-Credentials', 'true');
  newRes.headers.set('Access-Control-Allow-Headers', '*');

   // 创建一个新的URL对象，指向http://ipecho.net/plain
   let Ipurl = new URL("http://ipecho.net/plain")
   // 使用fetch函数获取该URL的响应
   let Ipresponse = await fetch(Ipurl)
   // 如果响应状态码为200，表示成功
//   if (Ipresponse.status == 200) {
     // 获取响应的文本内容
     let textip = await Ipresponse.text()
newRes.headers.set('TestLog',"This is Sydney@" + textip);

//const Guestip = req.headers['cf-connecting-ip'];
//newRes.headers.set('Guestip',Guestip); 

  // 将新的响应发送给客户端
  res.send(newRes);
}

// 监听3000端口
app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
