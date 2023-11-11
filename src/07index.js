const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const { URL } = require('url');

const SYDNEY_ORIGIN = 'https://sydney.bing.com';
const KEEP_REQ_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'connection',
  'cookie',
  'upgrade',
  'user-agent',
  'sec-websocket-extensions',
  'sec-websocket-key',
  'sec-websocket-version',
  'x-request-id',
  'content-length',
  'content-type',
  'access-control-request-headers',
  'access-control-request-method',
];

app.use((req, res, next) => {
  const currentUrl = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = new URL(SYDNEY_ORIGIN + currentUrl.pathname + currentUrl.search);

  const newHeaders = {};
  for (let key of KEEP_REQ_HEADERS) {
    if (req.headers[key]) {
      newHeaders[key] = req.headers[key];
    }
  }

  newHeaders['origin'] = targetUrl.origin;
  newHeaders['referer'] = 'https://www.bing.com/search?q=Bing+AI';

//    const randIP = '163.47.101.101';
//    newHeaders['X-Forwarded-For'] = randIP;

  const cookie = req.headers['Cookie'] || '';
  let cookies = cookie;
  
//    if (!cookie.includes('KievRPSSecAuth=')) {
  
 //       cookies += '; KievRPSSecAuth=' + '';
 //     }
  
//    if (!cookie.includes('_RwBf=')) {

 //       cookies += '; _RwBf=' +'';
 //     }
  
//    if (!cookie.includes('MUID=')) {

//          cookies += '; MUID=' + '074AD7F106536BC6392FC4C907CA6AEA';
//        }
    
  if (!cookie.includes('_U=')) {

      cookies += '; _U=' + '';
    }
  
    newHeaders['Cookie'] = cookies;

//    const oldUA = req.headers['user-agent'];
//    const isMobile = oldUA.includes('Mobile') || oldUA.includes('Android');
 //   if (isMobile) {
 //     newHeaders['user-agent'] =
//        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012';
 //   } else {
//      newHeaders['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35';
 //   }

  const options = {
    method: req.method,
    headers: newHeaders,
    hostname: targetUrl.hostname,
    path: targetUrl.pathname + targetUrl.search,
    port: targetUrl.port,
    protocol: targetUrl.protocol,
  };

  let proxy;
  if (targetUrl.protocol === 'https:') {
    proxy = https.request(options);
  } else {
    proxy = http.request(options);
  }

  proxy.on('response', (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error(err);
    res.status(500).send('Something went wrong');
  });

  req.pipe(proxy, { end: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
