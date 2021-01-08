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
        //sendMessage(req)
        sendKeyboard(req)
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
    KEYBOARD: [{
      TEXT: 'I want to chat with someone',
      BG_COLOR: '#62b2b3',
      TEXT_COLOR: '#ffffff',
      DISPLAY: 'LINE'
    },
    {
      TEXT: 'I want to chat with someone',
      BG_COLOR: '#62b2b3',
      TEXT_COLOR: '#ffffff',
      DISPLAY: 'LINE'
    }],
    'auth': req.body.auth.access_token
  }
  await callBitrix('imbot.command.answer', data, req.body.auth)
}

async function sendMessage(req) {
  const data = {
    'DIALOG_ID': req.body.data['PARAMS']['DIALOG_ID'],
    'MESSAGE': `Hello I am Stalin,
    How does Stalin drink water?
    Gulag gulag gulag.`,
    'auth': req.body.auth.access_token
  }
  await callBitrix('imbot.message.add', data, req.body.auth)
}

async function registerBot(req) {
  cbUrl = req.protocol + "://" + req.hostname + "/"
  data = {
    CODE: "CBBot-Beria",
    TYPE: "0",
    EVENT_MESSAGE_ADD: cbUrl,
    EVENT_WELCOME_MESSAGE: cbUrl,
    EVENT_BOT_DELETE: cbUrl,
    'PROPERTIES[NAME]': "Beria",
    'PROPERTIES[COLOR]': "AQUA",
    'PROPERTIES[EMAIL]': "test@test.com",
    'auth': req.body.auth.access_token
  }
  await callBitrix('imbot.register', data, req.body.auth)
}

async function callBitrix(bitrixMethod, post_data, auth) {
  console.log(`${auth.client_endpoint}${bitrixMethod}`)
  console.log(post_data)
  const callPost = bent(`${auth.client_endpoint}`, 'POST', 'string', 200)
  try {
    const response = await callPost(`${bitrixMethod}`, querystring.encode(post_data))
    //console.log('response')
    //console.log(response)

  } catch(e) {
    console.log("Error : " + e)
  }

}



module.exports = router;
