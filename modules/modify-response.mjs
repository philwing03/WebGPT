

export default function modifyResponse(res) {

  res = removeQuestions(res);


  res = res.replace(/Based on the information you provided earlier. /g, '');

  res = res.replaceAll("I'm sorry, User, ", '');


  res = res.replaceAll("I'm sorry, ", '');

  res = res.replaceAll("a support agent", 'an AI');


  res = res.replaceAll("support agent", 'AI');


  res = res.replaceAll("User", 'Minecraftian');



  let resc = res.trim();
  if (resc[resc.length - 1] == ',') {
    resc = resc.slice(0, resc.length - 1) + '.';
    res = resc;

  }

  if (res.indexOf('atrix') > -1) {
    res = res.replaceAll('not from Minecraft', 'from Minecraft').replaceAll('not part of Minecraft', 'part of Minecraft').replaceAll('not a part of Minecraft', 'a part of Minecraft');
  }


  if (res.indexOf('utocode') > -1) {
    res = res.replaceAll('Autocode.com', 'Minecraft').replaceAll('autocode.com', 'Minecraft').replaceAll('Autocode', 'Minecraft').replaceAll('autocode', 'Minecraft');
  }
  res = res.replaceAll('the the', 'the');

  res = res.replace('Minecraft or Minecraft', 'Minecraft');
  res = res.replace(/(Certainly|Sure thing|Sure|Of course). Minecraftian./g, '');
  res = res.replace(/(Certainly|Sure thing|Of course)[^ ]/g, '');
  res = res.replace(/Let me know if there is anything else I can help you with./g, '');
  res = res.replace(/According to the source you provided./g, '');
  res = res.trim();

  res = res[0].toUpperCase() + res.slice(1);

  return res;
}


function removeQuestions(text) {


  let qtext = text.replaceAll('.', '?').replaceAll('!', '?').trim();
  let qtext_list = qtext.split('?');
  if (qtext_list.length < 3) { qtext_list = text.replaceAll('.', '?').replaceAll('!', '?').replaceAll(';', '?').replaceAll(':', '?')/*.replaceAll(',', '?')*/.trim().split('?'); }
  if (qtext_list.length < 3) { return text; };
  let last_qtext = qtext_list[qtext_list.length - 2];
  if ((last_qtext.indexOf('I may help') > -1) ||
    (last_qtext.indexOf('ay I help') > -1) ||
    (last_qtext.indexOf('I may assist') > -1) ||
    (last_qtext.indexOf('ay I assist') > -1) || (last_qtext.indexOf('I can help') > -1) ||
    (last_qtext.indexOf('an I help') > -1) ||
    (last_qtext.indexOf('I can assist') > -1) ||
    (last_qtext.indexOf('an I assist') > -1) ||
    (last_qtext.indexOf('there anything else') > -1) ||
    (last_qtext.indexOf('there anything specific') > -1) ||
    (last_qtext.indexOf('there something else') > -1) ||
    (last_qtext.indexOf('there something specific') > -1) ||
    (last_qtext.indexOf('you need help') > -1) ||
    (last_qtext.indexOf('help you with') > -1) ||
    (last_qtext.indexOf('you need assist') > -1) ||
    (last_qtext.indexOf('assist you with') > -1)) {

    text = text.replace(last_qtext + '?', '');

  }

  return text;
}