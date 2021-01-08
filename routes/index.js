var express = require('express');
var router = express.Router();
const bent = require('bent')
const querystring = require('querystring')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET: " + req.body.event)
  console.log(req.params)
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log("POST: " + req.body.event)
  switch(req.body.event) {
    case 'ONAPPINSTALL' :
      registerBot(req)
      break;
    case 'ONIMBOTMESSAGEADD':
      if(req.body.data.USER.IS_EXTRANET=='Y') {
        sendMessage(req)
        //sendKeyboard(req)
      }
      break;
    case 'ONIMBOTJOINCHAT':
        sendMessage(req)
      break;
    default:
      console.log(req.body)
  }
  console.log('---')
});


async function sendKeyboard(req) {
  const data = {
    //COMMAND_ID: '1',
    MESSAGE_ID: req.body.data.PARAMS.MESSAGE_ID,
    MESSAGE: 'Do you want to chat to us in person about CooklyBookly or do you want information on how to use CooklyBookly?',
    'KEYBOARD[0][TEXT]': 'I want to chat with someone',
    'KEYBOARD[0][BG_COLOR]': '#62b2b3',
    'KEYBOARD[0][TEXT_COLOR]': '#ffffff',
    'KEYBOARD[0][DISPLAY]': 'LINE',
    'KEYBOARD[0][COMMAND]': 'main',
    'KEYBOARD[0][COMMAND_PARAMS]': 'chat',
    'KEYBOARD[1][TEXT]': 'I want to chat with someone',
    'KEYBOARD[1][BG_COLOR]': '#62b2b3',
    'KEYBOARD[1][TEXT_COLOR]': '#ffffff',
    'KEYBOARD[1][DISPLAY]': 'LINE',
    'KEYBOARD[1][COMMAND]': 'main',
    'KEYBOARD[1][COMMAND_PARAMS]': 'support'
  }
  await callBitrix('imbot.command.answer', data, req.body.auth)
}

async function sendMessage(req) {
  const data = {
    'DIALOG_ID': req.body.data['PARAMS']['DIALOG_ID'],
    'MESSAGE': `Hello I am Stalin,
    How does Stalin drink water?
    Gulag gulag gulag.`,
  }
  await callBitrix('imbot.message.add', data, req.body.auth)
}

async function registerBot(req) {
  // Register Bot
  cbUrl = req.protocol + "://" + req.hostname + "/"
  data = {
    CODE: "CBBotX",
    TYPE: "0",
    EVENT_MESSAGE_ADD: cbUrl,
    EVENT_WELCOME_MESSAGE: cbUrl,
    EVENT_BOT_DELETE: cbUrl,
    'PROPERTIES[NAME]': "Cookly Bot",
    'PROPERTIES[COLOR]': "AQUA",
    'PROPERTIES[EMAIL]': "test@test.com",
  }
  await callBitrix('imbot.register', data, req.body.auth)

  // Register Command
  data = {
    BOT_ID: 'CBBotX',
    COMMAND: "help",
    COMMON: 'N',
    HIDDEN: 'N',
    EXTRANET_SUPPORT: 'Y',
    EVENT_COMMAND_ADD: cbUrl + "mainMenu"
  }
  await callBitrix('imbot.command.register', data, req.body.auth)
}

async function callBitrix(bitrixMethod, post_data, auth) {
  post_data.auth = auth.access_token
  console.log(`${auth.client_endpoint}${bitrixMethod}`)
  console.log(post_data)
  const callPost = bent(`${auth.client_endpoint}`, 'POST', 'string', 200)
  try {
    const response = await callPost(`${bitrixMethod}`, querystring.encode(post_data))
    console.log('RESPONSE : ')
    console.log(response)

  } catch(e) {
    console.log("Error : " + e)
  }

}



module.exports = router;
