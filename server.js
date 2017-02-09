var express = require("express");
var app = express();
var config = require('./config');
var path = __dirname + '/views/';
var Twit = require('twit');
var T = new Twit(config);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 */
var bodyParser = require('body-parser');

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({ extended: true }));

// used to serve static files like css and js that are inside the public folder
app.use('/', express.static(__dirname + '/public'));


// displays index.html on the home page
app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  res.sendFile(path + "index.html");
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/twitterOutput', function(req, res){

  userInput = req.body.userInput;

             if(userInput != null || userInput != ""){
                var params = {
                  q: userInput,
                  count: 25, // displays 25 tweets
                  result_type: 'recent'
                };

               T.get('search/tweets', params, gotData);
               function gotData(err, data, response) {
                 var tweets = data.statuses;

                 if(tweets != null){
                 res.writeHead(200, {'content-type':'text/html; charset=utf-8'});

                 for (var i = 0; i < tweets.length; i++) {

                   var user_name = tweets[i].user.name;
                   var s_name = tweets[i].user.screen_name;
                   var p_image = tweets[i].user.profile_image_url_https;
                   var t_message = tweets[i].text;

                   res.write('<br>');
                   res.write('<img src='+p_image+'>');
                   res.write('<br>');
                   res.write('<b>'+'Name: '+'</b>' + user_name + '<br>');
                   res.write('<b>'+'Screen Name: '+'</b>'  +'<a href="https://twitter.com/'+s_name+'">'+'@'+s_name+'</a>'+'<br>');
                   res.write('<b>'+'Message: '+'</b>' + t_message  + '<br>');
                   res.write('<br>');
                 }
                 res.end();
               }
               }
             }

  //console.log(userInput);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
