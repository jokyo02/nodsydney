const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');

// create an HTTPS agent with the proxy settings
const proxy = new HttpsProxyAgent({
  host: 'your.proxy.host',
  port: 'your.proxy.port',
  // optionally, you can provide authentication credentials
  auth: 'user:password'
});

const serverUrl = 'sydney.bing.com';

const server = require('http').createServer(function(req, res) {
  // add a condition
  if (req.url === '/') {
    // return a simple message
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WellCome! Site is working ......');
  } else {
    // make an HTTPS request to the target server using the proxy agent
    const options = {
      hostname: serverUrl,
      port: 443,
      path: req.url,
      method: req.method,
      headers: req.headers,
      agent: proxy
    };
    const proxyReq = https.request(options, function(proxyRes) {
      // pipe the response from the target server to the client
      proxyRes.pipe(res);
    });
    // pipe the request from the client to the target server
    req.pipe(proxyReq);
  }
});

server.listen(7860, function() {
  console.log('Listen on Port 7860......');
});
