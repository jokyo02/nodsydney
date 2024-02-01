
const httpProxy = require('http-proxy');
//const httpProxy = require('https-proxy-agent');
const proxy = httpProxy.createProxyServer({});

// 将给定的代码添加到当前文件中
const IP_RANGE = [
  ['4.150.64.0', '4.150.127.255'],       // Azure Cloud EastUS2 16382
  ['4.152.0.0', '4.153.255.255'],        // Azure Cloud EastUS2 131070
  // ... (其他IP范围)
  ['13.80.0.0', '13.81.255.255'],        // Azure Cloud WestEurope 131070
  ['20.73.0.0', '20.73.255.255'],        // Azure Cloud WestEurope 65534
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const ipToInt = (ip) => {
  const ipArr = ip.split('.');
  let result = 0;
  result += +ipArr[0] << 24;
  result += +ipArr[1] << 16;
  result += +ipArr[2] << 8;
  result += +ipArr[3];
  return result;
};

const intToIp = (intIP) => {
  return `${(intIP >> 24) & 255}.${(intIP >> 16) & 255}.${(intIP >> 8) & 255}.${intIP & 255}`;
};

const getRandomIP = () => {
  const randIndex = getRandomInt(0, IP_RANGE.length);
  const startIp = IP_RANGE[randIndex][0];
  const endIp = IP_RANGE[randIndex][1];
  const startIPInt = ipToInt(startIp);
  const endIPInt = ipToInt(endIp);
  const randomInt = getRandomInt(startIPInt, endIPInt);
  const randomIP = intToIp(randomInt);
  return randomIP;
};

const randomString = (e) => {
  e = e || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678_-+";
  var n = "";
  for (let i = 0; i < e; i++) n += t.charAt(getRandomInt(0, t.length));
  return n;
}


//const https = require('https');
//const fs = require('fs');

//const options = {
//  key: fs.readFileSync('/path/to/private.key'),
 // cert: fs.readFileSync('/path/to/certificate.crt')
//};

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Origin', 'https://www.bing.com');
  const randIP = getRandomIP();
  proxyReq.setHeader('X-Forwarded-For', randIP);
});

const serverUrl = 'www.bing.com';

const server = require('http').createServer(function(req, res) {
//const server = https.createServer(options, function(req, res) {
  // 添加一个判断条件
//  if (req.url === '/') {
    // 返回一个简单的消息
 //   res.writeHead(200, {'Content-Type': 'text/plain'});
 //   res.end('WellCome! Site is working ......');
//  } else {
    // 原来的代码
    proxy.web(req, res, {
      target: 'wss://' + serverUrl,
      ws: true,
      changeOrigin: true
    });
//  }
});

server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, {
    target: 'wss://' + serverUrl,
    changeOrigin: true
  });
});

server.listen(7860, function() {
  console.log('Listen on Port 7860......');
});

