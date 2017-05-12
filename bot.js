console.log('initializing...');

var fs = require('fs');
var path = require('path');
var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);
var objects = require('./classes');
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

start();


function start()
{
	console.log('The Diplomacy Bot has started');
}

function tweetEvent(eventMsg) {
	
    var replyTo = eventMsg.in_reply_to_screen_name;
    var from = eventMsg.personFrom;
	var text = eventMsg.text;
	var senderUserName = eventMsg.user.screen_name;
	var senderName = eventMsg.user.name;

	if(replyTo === 'JohnLockeBot')
	{
		text = text.replace(/@JohnLockeBot /g, '');
		//do something
	}

}

function tweet(txt) {
	
	//txt += '[' + String(Math.floor(Math.random() * 10000)) + ']';
	
	var tweet = {
		status: txt
	}

	T.post('statuses/update', tweet, tweeted);
	
	function tweeted(err, data, response) {
		if (err) {
			console.log('Somthing went wrong when trying to tweet! Dumping to err file.');
			dumpError(err);
		}
	}
}

function createGame(gameName, admin)
{
    var exists = false;
    path.exists(gameName + '.json', function (b) { exists = b; })
    if (exists) { tweet('@' + admin + ' - There is already a game with that name.'); return; }

    fs.writeFile(gameName + '.json', '');
	//find a way to encode:
	//the username of the admin of the game
	//player names
	//the lock status of the game
	//province & empire information
}

function addPlayerToGame(gameName, player)
{
    var contents = fs.readFileSync(gameName + ".json");
    //if (contents.locked) { tweet('@' + admin + ' - You cannot join game - it is locked!'); return; }
	//fs.writeFile(gameName + '.json', );
	//find a way to edit the player names
}

function lockGame(gameName)
{
	//fs.writeFile(gameName + '.json', );
	//edit the lock state
}

function deleteGame(gameName)
{
    //find out how to delete a json file
}

function dumpError(err) {
	var json = JSON.stringify(err, null, 2);
	fs.writeFile("err.json", json);
}

