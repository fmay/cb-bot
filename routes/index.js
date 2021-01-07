var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

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
      registerBot(req);
      break;
  }
  console.log()
});


function registerBot(req) {
  cbUrl = req.protocol + "://" + req.hostname + "/"
  data = {
    CODE: "CBBotxx",
    TYPE: "O",
    EVENT_MESSAGE_ADD: cbUrl,
    EVENT_WELCOME_MESSAGE: cbUrl,
    EVENT_BOT_DELETE: cbUrl,
    OPENLINE: "Y",
    'PROPERTIES[NAME]': "Stalin",
    'PROPERTIES[COLOR]': "AQUA",
    'PROPERTIES[EMAIL]': "test@test.com",
    'auth': req.body.auth.access_token
  }
  callBitrix('imbot.register', data, req.body.auth)
}

function callBitrix(bitrixMethod, post_data, auth) {

  var post_options = {
    host: auth.domain,
    //port: '443',
    path:  '/rest/' + bitrixMethod,
    method: 'POST'
    /*headers: {
        'Content-Type': 'application/json'
    }*/
};

  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk)
    });
  });

  console.log(querystring.encode(post_data))
  post_req.write(querystring.encode(post_data))
  post_req.end()
}



module.exports = router;
