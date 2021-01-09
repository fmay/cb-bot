var express = require('express');
var router = express.Router();
const bent = require('bent')
const querystring = require('querystring')

var _botId = ""

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
        //sendMessage(req)
        sendKeyboard(req)
      }
      break;
    case 'ONIMBOTJOINCHAT':
      sendJoined(req)
      break;
    default:
      console.log(req.body)
  }
});

async function sendKeyboard(req) {
  const data = {
    //COMMAND_ID: 'MainMenu',
    //MESSAGE_ID: req.body.data.PARAMS.MESSAGE_ID,
    'DIALOG_ID': req.body.data['PARAMS']['DIALOG_ID'],
    'SYSTEM': 'N',
    'MESSAGE': 'Keyboard message',
    'KEYBOARD[0][TEXT]': 'CHAT',
    'KEYBOARD[0][TEXT_COLOR]': '#ffffff',
    'KEYBOARD[0][BG_COLOR]': '#62b2b3',
    'KEYBOARD[0][DISPLAY]': 'LINE',
    'KEYBOARD[0][HIDDEN]': 'N',
    'KEYBOARD[0][LINK]': "https://google.com",
    //'KEYBOARD[0][COMMAND]': 'MainMenu'
    /*'KEYBOARD[0][COMMAND]': 'main',
    'KEYBOARD[0][COMMAND_PARAMS]': 'chat',
    'KEYBOARD[1][TEXT]': 'I have a product usage question',
    'KEYBOARD[1][BG_COLOR]': '#62b2b3',
    'KEYBOARD[1][TEXT_COLOR]': '#ffffff',
    'KEYBOARD[1][DISPLAY]': 'LINE',
    'KEYBOARD[1][COMMAND]': 'main',
    'KEYBOARD[1][COMMAND_PARAMS]': 'support'*/
  }
  await callBitrix('imbot.message.add', data, req.body.auth)
}

async function sendJoined(req) {
  const data = {
    //'BOT_ID': req.body.data.BOT[0].BOT_ID,
    'DIALOG_ID': req.body.data['PARAMS']['DIALOG_ID'],
    'MESSAGE': `You joined`,
  }
  await callBitrix('imbot.message.add', data, req.body.auth)
}

async function sendMessage(req) {
  const data = {
    //'BOT_ID': req.body.data.BOT[0].BOT_ID,
    //'USER_TO_ID': req.body.data.PARAMS.TO_USER_ID,
    //'DIALOG_ID': 'chat'+ req.body.data.PARAMS.CHAT_ID,
    //'DIALOG_ID': req.body.data.USER.ID,
    //'USER_FROM_ID': req.body.data['PARAMS']['FROM_USER_ID'],
    'DIALOG_ID': req.body.data['PARAMS']['DIALOG_ID'],
    'MESSAGE': `A simple message`
  }
  await callBitrix('imbot.message.add', data, req.body.auth)
}


async function registerBot(req) {
  // Register Bot
  cbUrl = req.protocol + "://" + req.hostname + "/"
  version = "CBChatbotV4"
  data = {
    CODE: version,
    TYPE: "O",
    OPENLINE: 'Y',
    EVENT_HANDLER: cbUrl,
    'PROPERTIES[NAME]': version,
    'PROPERTIES[COLOR]': "AQUA",
    'PROPERTIES[EMAIL]': "fmay@cooklybookly.com",
  }
  console.log("REGISTERING : " + data.CODE)

  //await callBitrix('imbot.bot.list', {}, req.body.auth)
  //delBots = []
  //await callBitrix('imbot.unregister', {"BOT_ID": 107}, req.body.auth)
  //return

  await callBitrix('imbot.register', data, req.body.auth)


  // Register Command
  data = {
    BOT_ID: _botId,
    COMMAND: "MainMenu",
    COMMON: 'N',
    HIDDEN: 'N',
    EXTRANET_SUPPORT: 'Y',
    'LANG[0][LANGUAGE_ID]': 0,
    'LANG[0][TITLE]': "Get echo message",
    'LANG[0][PARAMS]': "some text",
    EVENT_COMMAND_ADD: cbUrl
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
    if(bitrixMethod === "imbot.register") {
      _botId = JSON.parse(response).result;
    }
    console.log(response)
    console.log("-------------------")

  } catch(e) {
    console.log(await e.json())
    console.log("-------------------")
  }

}


// https://thin-crab-47.loca.lt/

module.exports = router;
