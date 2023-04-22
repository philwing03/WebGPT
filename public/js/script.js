
window.sleep = function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function encodeSnippets(code) {
  let codeChunks = code.split('```');
  const codeChunks_length = codeChunks.length;
  for (let i = 1; i < codeChunks_length; i += 2) {

    codeChunks[i] = btoa(codeChunks[i]);

  }
  code = codeChunks.join(btoa('```'));

  let codeBits = code.split('`');
  const codeBits_length = codeBits.length;
  for (let i = 1; i < codeBits_length; i += 2) {

    codeBits[i] = btoa(codeBits[i]);

  }
  code = codeBits.join(btoa('`'));

  return code;
}

function decodeSnippets(code) {
  let codeChunks = code.split(btoa('```'));
  const codeChunks_length = codeChunks.length;
  for (let i = 1; i < codeChunks_length; i += 2) {
    try {

      codeChunks[i] = atob(codeChunks[i]);

    } catch (e) { continue; }
  }
  code = codeChunks.join('```');

  let codeBits = code.split(btoa('`'));
  const codeBits_length = codeBits.length;
  for (let i = 1; i < codeBits_length; i += 2) {
    try {

      codeBits[i] = atob(codeBits[i]);

    } catch (e) { continue; }
  }
  code = codeBits.join('`');


  return code;
}

function lcws(text1, text2) {/*longest common word subsequence*/
  text1 = text1.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').split(' ');
  text2 = text2.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').split(' ');

  const dp = Array(text1.length + 1).fill(0).map(Þ => Array(text2.length + 1).fill(0));
  const dp_length = dp.length;
  for (let i = 1; i < dp_length; i++) {

    for (let j = 1; j < dp[i].length; j++) {
      // If the words match, look diagonally to get the max subsequence before this letter and add one
      if (text1[i - 1] == text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        // If there is no match, set the cell to the previous current longest subsequence
        dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
      }
    }
  }
  return dp[text1.length][text2.length]
}

function isSimilarPhrase(text1, text2) {
  text1 = text1.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');
  text2 = text2.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');

  let numerator = lcws(text1, text2);

  let ratio1 = numerator / text1.split(' ').length;

  let ratio2 = numerator / text2.split(' ').length;

  if (Math.max(ratio1, ratio2) >= 0.8) {

    return true;

  } else {

    return false;

  }


}

function removeRedundant(passage) {

  let isSentenceModified = false;
  for (let pass = 0; pass < 2; pass++) {
    let mpassage = passage;
    let pass_regex = /[?!¿¡]/g;
    if (pass) { pass_regex = /[?!¿¡.,:;]/g; }
    mpassage = mpassage.replace(pass_regex, '.')
      .replaceAll('..', '.')
      .replaceAll('..', '.')
      .replaceAll('  ', ' ')
      .replaceAll('  ', ' ');
    console.log(mpassage);
    let mpass_list = mpassage.split('.');
    console.log(mpass_list);
    const mpass_list_length = mpass_list.length;
    for (let i = 0; i < mpass_list_length; i++) {
      try {
        if ((mpass_list[i].length > 1) && (mpass_list[i].split(' ').length > 3)) {
          for (let x = 0; x < mpass_list_length; x++) {
            try {
              if ((i != x) && (mpass_list[x].length > 1) && (mpass_list[x].split(' ').length > 3)) {
                if (isSimilarPhrase(mpass_list[i], mpass_list[x])) {
                  if (mpass_list[i].length < mpass_list[x].length) {

                    mpass_list[i] = '';
                    isSentenceModified = true;
                    break;

                  } else {

                    mpass_list[x] = '';
                    isSentenceModified = true;
                    continue;

                  }
                }
              }
            } catch (e) { continue; }
          }
        }
      } catch (e) { continue; }
    }
    console.log(isSentenceModified);
    if (isSentenceModified) {
      passage = mpass_list.join('.')
        .replaceAll('..', '.')
        .replaceAll('..', '.')
        .replaceAll('  ', ' ')
        .replaceAll('  ', ' ')
        .replaceAll(',.', '.')
        .replaceAll('.,', '.');
    }
  }
  return passage;


}

async function yahooScrape(txt) {

  let res = await (await fetch('https://search.yahoo.com/search?q=' + txt)).text();
  const parser = new DOMParser();
  let adocument = parser.parseFromString(res, "text/html");
  const extra_tags = adocument.querySelectorAll('head,link,meta,style,script');
  const extra_tags_length = extra_tags.length;
  for (let i = 0; i < extra_tags_length; i++) {
    try {

      extra_tags[i].remove();

    } catch (e) { continue; }
  }
  let text = adocument.body.textContent;
  text = text.replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');


  let words = text.split(' ');
  let words_length = words.length;
  text = '';

  for (let i = 0; i < words_length; i++) {
    let word = words[i].trim();
    if (word.length > 0) {
      text = text + word + ' ';
    }
  }

  return text;

}

// Create a Unique UUID for user chat history
function createUUID() {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

// Generate session name
let sessionUsername = `User ${createUUID()}`;

// Convert object to query parameters
let serialize = (obj) => {
  return Object.keys(obj).map(key => {
    return [
      encodeURIComponent(key),
      encodeURIComponent(obj[key])
    ].join('=');
  }).join('&');
}

// Add a message to the chat
let createMessage = (role, content) => {
  let messagesEl = document.querySelector('.chat-content');
  let messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(role);
  let contentEl = document.createElement('div');
  contentEl.classList.add('content');
  contentEl.innerText = content;
  messageEl.appendChild(contentEl);
  messagesEl.appendChild(messageEl);
  return {
    messages: messagesEl,
    content: contentEl
  };
};


// wait until the whole message is done before printing;
let sendMessageSync = async (username, content, messageListener) => {
  content = content + ' in Minecraft'
  let query = serialize({
    username,
    content,
    _stream: false
  });

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/json',
      'think': 'shallow'
    }
  };

  let json = JSON.parse(await (await fetch(`./chat/?${query}`, options)).text());
  let res_words = json.response.split(' ');
  let res_words_length = res_words.length;
  for (let i = 0; i < res_words_length; i++) {
    messageListener(res_words[i] + ' ');
    await sleep(25);
  }
  await formatCode();
  await formatSnip();
  return json.response;
}

function extractTokens(text) {
  let tokens = [];
  let textList = text.split('"');
  const textList_length = textList.length;
  for (let i = 1; i < textList_length; i += 2) {
    try {

      tokens.push('"' + textList[i] + '"');

    } catch (e) { continue; }
  }

  return tokens.join(' OR ');
}
async function parallelSends(username, listx) {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/json,*/*',
      'think': 'shallow'
    }
  };
  let webscrape = [];
  try {
    webscrape = JSON.parse(await (await fetch('https://WebGPT-cse.philwing03.repl.co/webscraper?' + encodeURIComponent(listx))).text());
  } catch (e) { webscrape = []; }
  console.log(webscrape);
  const webscrape_length = webscrape.length;
  let feeder = [];
  for (let i = webscrape_length - 1; i > -1; i--) {
    try {
      content = 'Additional information ' + listx + 'part ' + (i + 1) + ' of ' + webscrape_length + ' content:{' + webscrape[i] + '}';
      console.log('content length1: ' + encodeURIComponent(content).length);
      if (content.length > 500) { content = content.replaceAll(' ', '-'); }
      console.log('content length2: ' + encodeURIComponent(content).length);
      let query = serialize({ username, content, _stream: false });
      feeder.push(Promise.race([fetch(`https://web-gpt-demo.com/chat/?${query}`, options), sleep(2000)]));
    } catch (e) { continue; }
  }



  await /*Promise.race([*/Promise.all(feeder)/*,sleep(5000)])*/;

  return 0;
}
let analyzeMessageSync = async (username, content, messageListener) => {
  let prompt = content;
  /* content = 'Please provide the exact tokens to enter into a google search bar in order to respond to the prompt {' + content + '}';*/
  let query = serialize({
    username,
    content,
    _stream: false
  });

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/json',
      'think': 'shallow'
    }
  };

  /* let json = JSON.parse(await (await fetch(`./chat/?${query}`, options)).text());
   let searchTokens = extractTokens(json.response);*/
  //console.log(searchTokens);
  let list = ['https://search.yahoo.com/search?q=' + prompt + ' in Minecraft'];//await searchAPISend(searchTokens);
  console.log(list[0]);
  let sends = [];
  sends.push(parallelCSESends(username, prompt));
  const list_length = list.length;
  for (let x = 0; x < list_length; x++) {
    try {
      sends.push(parallelSends(username, list[x]))
    } catch (e) { continue; }
  }
  await Promise.race([Promise.all(sends), sleep(15000)]);
  await sleep(100);

  content = prompt;
  query = serialize({ username, content, _stream: false });
  let json_answer = JSON.parse(await (await fetch(`./chat/?${query}`, options)).text());
  let part1 = json_answer.response;
  part1 = part1.split(',');
  if (part1[0].includes('ased on the')) {
    part1[0] = '';
  }

  if (part1[0].includes('ccording to the')) {
    part1[0] = '';
  }

  if (part1[0].includes('d earlier')) {
    part1[0] = '';
  }
  part1 = part1.join(',').trim();
  part1[0] = '';
  content = "expand on your previous response";
  //content = "continue";
  let elab = serialize({ username, content, _stream: false });
  let json_elab = JSON.parse(await (await fetch(`./chat/?${elab}`, options)).text());
  let part2 = json_elab.response.split('.');
  const part2_length = part2.length;
  for (let i = 0; i < part2_length; i++) {

    if (part1.includes(part2[i])) {
      part2[i] = '';
    }

  }
  part2 = part2.join('.').replaceAll('..', '.').replaceAll('..', '.');

  let full_msg = part1 + ' ' + part2;
  full_msg = encodeSnippets(full_msg);
  full_msg = removeRedundant(full_msg).replaceAll(' .', '.');
  full_msg = full_msg.replace(/^\.|^,/, '').trim();
  full_msg = full_msg.trim().split('');
  const full_msg_length = full_msg.length;
  for (let i = 0; i < full_msg_length; i++) {
    try {
      // 
      if ((full_msg[i] == '.') && (full_msg[i + 1] == ' ') && (full_msg[i + 2] == full_msg[i + 2].toLowerCase())) {

        full_msg[i] = ',';

      }

    } catch (e) { continue; }
  }
  full_msg[0] = full_msg[0].toUpperCase();
  full_msg = full_msg.join('')
    .replaceAll(',.', '.')
    .replaceAll('.,', '.');
  full_msg = decodeSnippets(full_msg);
  // full_msg = await (await fetch('https://grammarly.philwing03.repl.co/' + encodeURIComponent(full_msg))).text();
  document.querySelector('[thinking]')?.removeAttribute('thinking');
  let res_words = full_msg.split(' ');
  let res_words_length = res_words.length;
  for (let i = 0; i < res_words_length; i++) {
    messageListener(res_words[i] + ' ');
    await sleep(25);
  }
  await formatCode();
  await formatSnip();
  return json_elab.response;
}

// Prepare the page to handle interaction


document.addEventListener('load', firstMSG);

firstMSG();

async function firstMSG() {
  if (document.fmg) { return; }
  document.fmg = true;
  await sleep(200);
  fixHeight();
  let button = document.querySelector('button#send');
  let deep = document.querySelector('button#deep>span');
  let textarea = document.querySelector('textarea#input');
  let form = document.querySelector('form#chat');
  textarea.addEventListener('keydown', async (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent reload
    if (!form.hasAttribute('disabled')) {
      let content = textarea.value;
      content = content.trim();
      if (content) {
        form.setAttribute('disabled', '');
        textarea.value = '';
        let response = '';
        let userEls = createMessage('user', content);
        let assistantEls = createMessage('assistant', '');
        assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
        await sendMessageSync(sessionUsername, content, (message) => {
          response += message;
          let chunkEl = document.createElement('span');
          chunkEl.classList.add('chunk');
          chunkEl.innerText = message;
          assistantEls.content.appendChild(chunkEl);
          assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
        });
        form.removeAttribute('disabled');
      }
    }
  });

  deep.addEventListener('mouseup', async (e) => {
    e.preventDefault(); // Prevent reload
    if (!form.hasAttribute('disabled')) {
      let content = textarea.value;
      content = content.trim();
      if (content) {
        form.setAttribute('disabled', '');
        textarea.value = '';
        let response = '';
        let userEls = createMessage('user', content);
        let assistantEls = createMessage('assistant', '');
        let msgEl = assistantEls.content.parentElement;
        msgEl.setAttribute('thinking', 'Searching');
        assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
        processing();
        await analyzeMessageSync(sessionUsername, content, (message) => {
          response += message;
          let chunkEl = document.createElement('span');
          chunkEl.classList.add('chunk');
          chunkEl.innerText = message;
          assistantEls.content.appendChild(chunkEl);
          assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
        });
        msgEl.removeAttribute('thinking');
        form.removeAttribute('disabled');
      }
    }
  });

  // Create initial message
  let gpt = 'WebGPT';
  if (window.location.host.toLowerCase().includes('phil')) {
    gpt = 'MinecraftGPT';
  }
  let assistantEls = createMessage(
    'assistant',
    `Hi there! I'm ` + gpt + `.`
  );
}

// iOS resize handler for message input
if (window.visualViewport) {
  const loadHeight = window.visualViewport.height;
  const resizeHandler = fn => {
    document.body.style.height = window.visualViewport.height.toString() + 'px';
    let headerEl = document.querySelector('.chat-header');
    let messagesEl = document.querySelector('.chat-content');
    if (window.visualViewport.height < loadHeight) {
      headerEl.style.display = 'none';
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else {
      headerEl.style.display = '';
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }
  window.visualViewport.addEventListener('resize', resizeHandler);
}

//reformat code to look a little nicer
async function formatCode() {
  let gpt_msgs = document.querySelectorAll('div.message.assistant>div.content');
  let last_msg = gpt_msgs[gpt_msgs.length - 1];
  let txt = last_msg.innerHTML.toString();
  if (txt.indexOf('```') > -1) {

    txt = txt.replace('```', '<pre><code><span>').replace('```', '</span></code></pre>');


    last_msg.innerHTML = txt;

    await sleep(100);
    await formatCode();
  }




  return 0;
}


async function formatSnip() {
  let gpt_msgs = document.querySelectorAll('div.message.assistant>div.content');
  let last_msg = gpt_msgs[gpt_msgs.length - 1];
  let txt = last_msg.innerHTML.toString();
  if (txt.indexOf('`') > -1) {

    txt = txt.replace('`', '<code>').replace('`', '</code>');


    last_msg.innerHTML = txt;
    await formatSnip();
  }
  return 0;
}

window.mobile = (navigator.userAgent.toLowerCase().indexOf('mobile') > -1);

setInterval(fixHeight, 500);
function fixHeight() {


  let chatWindow = document.querySelector('div.chat');
  if ((document.body.clientHeight > document.body.clientWidth) || (window.top != window)) {

    if (chatWindow.style.maxWidth != '100vw') { chatWindow.style.maxWidth = '100vw'; }

  } else {


    if ((chatWindow.style.maxWidth != '90vw') && (!window.mobile)) { chatWindow.style.maxWidth = '90vw'; }

  }




}

void function SendPrimer() {

  document.addEventListener('load', prime);

  prime();

  function prime() {
    if (document.primed) { return; }
    document.primed = true;
    let botName = document.querySelector('h3').textContent.trim();
    let nameChange = '';
    let primer = '';
    if (botName.toLowerCase() != 'webgpt') {

      nameChange = ' I would like you to refer to yourself as ' + botName + ' and I may refer to you as ' + botName + ' or some shortened variation of ' + botName + '.';

      primer = '...PRIMER...';

    }

    sendMessageSync(sessionUsername,

      (primer + 'I have some additional parameters that I would like you to follow for the remainder of the chat. I would like for you to refer to me as Minecraftian rather than User unless I give you another name. I will refer to Autocode.com as Minecraft and I would like you to do the same. I would like you to behave as if these specification had always been true and not based on my requesting it. So please do not remind me that I requested these things.')

      , Ø=>Ø);


  }
}?.(); 


function JSONExtract(raw, key) {

  let json_key = '"' + key + '"';
  let json_val = raw.split(json_key)[1].split('"')[1];

  return json_val;


}


void async function LoadShortCSE() {

  let cx = 'd293a20a687cb40e7';
  let cxurl = 'https://WebGPT-cse.philwing03.repl.co/cse.js?hpg=1&cx=' + cx;

  let script_raw = await (await fetch(cxurl)).text();

  let cse_tok = JSONExtract(script_raw, "cse_token");

  localStorage.setItem('cse_tok', cse_tok);
}?.();


async function cseFetch(query) {

  let cx = 'd293a20a687cb40e7';

  let cse_tok = localStorage.getItem('cse_tok');

  let cse_url = 'https://WebGPT-cse.philwing03.repl.co/cse/element/v1?rsz=filtered_cse&num=7&hl=en&source=gcsc&gss=.com&cx=' + cx + '&q=' + encodeURIComponent(query) + '&safe=off&cse_tok=' + cse_tok + '&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr,cc&cseclient=hosted-page-client&callback=google.search.cse.api';
  let preslice = (await (await fetch(cse_url)).text()).split('google.search.cse.api(')[1]
  let cse_res = JSON.parse(preslice.slice(0, preslice.length - 2));

  let text = '';
  const results = cse_res.results;
  const results_length = results.length;
  for (let i = 0; i < results_length; i++) {
    text = text + results[i].url + ' ';
    text = text + results[i].contentNoFormatting;
  }
  return text.split('https://');
}


async function parallelCSESends(username, query) {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/json,*/*',
      'think': 'shallow'
    }
  };
  let webscrape = [];
  try {
    webscrape = await cseFetch(query);
  } catch (e) { webscrape = []; }
  console.log(webscrape);
  const webscrape_length = webscrape.length;
  let feeder = [];
  for (let i = webscrape_length - 1; i > -1; i--) {
    try {
      let content = 'Additional information {' + webscrape[i] + '}';
      console.log('content length1: ' + encodeURIComponent(content).length);
      if (content.length > 500) { content = content.replaceAll(' ', '-'); }
      console.log('content length2: ' + encodeURIComponent(content).length);
      let query = serialize({ username, content, _stream: false });
      feeder.push(Promise.race([fetch(`https://web-gpt-demo.com/chat/?${query}`, options), sleep(2000)]));
    } catch (e) { continue; }
  }



  await /*Promise.race([*/Promise.all(feeder)/*,sleep(5000)])*/;

  return 0;
}

async function processing() {
  await sleep(1000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Investigating');
  document.querySelector('[thinking]').style.fontFamily = 'Minecraftia';
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Researching');
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Scanning');
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Analyzing');
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Examining');
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Reviewing');
  await sleep(2000);
  document.querySelector('[thinking]')?.setAttribute('thinking', 'Reflecting');
}
/*void async function test(){
let test = await cseFetch('green');
console.log(test);
console.log(test.split('...'));
}?.();*/