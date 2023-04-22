import fetch from 'node-fetch';
import http from 'http';
import fileFromRequest from './static-files.mjs';
import modifyResponse from './modules/modify-response.mjs';
import modifyRequest from './modules/modify-request.mjs';

http.createServer(onRequest).listen(3000);

//fetch('https://grammarly.servleteer.repl.co/'+encodeURIComponent("People don't think it be like it is but it do."));

async function onRequest(req, res) {

  if (req.url == '/ping') {
    res.statusCode = 200;
    return res.end();
  }

  let path = req.url.replaceAll('*', '');
  let pat = path.split('?')[0].split('#')[0];

  if (pat == '/chat/') {
    let req_url = req.url;
    if (req.headers['think'] == 'deep') {
      let req_url_list = req_url.split('&content=');
      let reqText = decodeURIComponenet(req_url_list[1].split('&_stream=false')[0]);


      req_url = req_url_list + '&content=' + encodeURIComponent(modifyRequest(reqText)) + '&_stream=false';

    }



    const options = {
      method: 'GET',
      headers: {
        'Accept': 'text/json'
      }
    };

    res.statusCode = 200;
    let resJson = JSON.parse(await (await fetch('https://web-gpt-demo.com/' + req_url, options)).text());
    resJson.response = modifyResponse(resJson.response);
    return res.end(JSON.stringify(resJson));

  }

  return fileFromRequest(req, res);
}


