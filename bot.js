console.log('initializing...');

var fs = require('fs');
var path = require('path');
var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

var saveDirectory = __dirname + '/games/';

var emptyGameSave = {
    'locked': false,
    'admin': '',
    'countries': {
        'AUSTRO-HUNGARIA': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['bohemia', 'budapest', 'galicia', 'trieste', 'tyrelia', 'vienna']
        },
        'ENGLAND': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['clyde', 'edinburgh', 'liverpool', 'london', 'wales', 'yorkshire']
        },
        'FRANCE': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['brest', 'burgundy', 'gascony', 'marseillas', 'paris', 'picardy']
        },
        'GERMANY': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['berlin', 'kiel', 'munich', 'prussia', 'ruhr', 'silesia']
        },
        'ITALY': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['apulia', 'naples', 'piedmont', 'rome', 'tuscany', 'venice']
        },
        'RUSSIA': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['livonia', 'moscow', 'sevastapol', 'st petersburg', 'ukraine', 'warsaw']
        },
        'OTTOMANS': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['ankara', 'armenia', 'constantinople', 'smyrna', 'syria']
        },
        'NEUTRAL': {
            'provinces': ['albania', 'belgium', 'bulgaria', 'finland', 'greece', 'holland', 'norway', 'north africa', 'portugal', 'rumania', 'serbia', 'spain', 'sweden', 'tunis']
        }

    }

};

//this var is rather messy but it will be extremely useful when generating a picture of the current game map. 
//the grayscale colors of each province will be in the color var for each province, and the center of the province (for placing armies and fleet icons) will be in the center pos var (probably in pixel coordinates)
var provinces = {
    'bohemia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'budapest': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'galicia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'trieste': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'tyrelia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'vienna': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'clyde': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'edinburgh': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'liverpool': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'london': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'wales': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'yorkshire': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'brest': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'burgundy': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'gascony': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'marseilles': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'paris': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'picardy': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'berlin': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'kiel': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'munich': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'prussia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'ruhr': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'silesia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'apulia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'naples': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'piedmont': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'rome': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'tuscany': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'venice': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'livonia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'moscow': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'sevastapol': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'st petersburg': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'ukraine': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'warsaw': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'ankara': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'armenia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'constantinople': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'smyrna': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'syria': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'albania': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'belgium': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'bulgaria': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'finland': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'greece': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'holland': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'norway': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'north africa': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'portugal': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'rumania': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'serbia': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'spain': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'sweden': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
    'tunis': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },

    'adriatic sea': { 'centerPos': [0, 0] },
    'aegean sea': { 'centerPos': [0, 0] },
    'baltic sea': { 'centerPos': [0, 0] },
    'barents sea': { 'centerPos': [0, 0] },
    'black sea': { 'centerPos': [0, 0] },
    'eastern mediterranean': { 'centerPos': [0, 0] },
    'english channel': { 'centerPos': [0, 0] },
    'gulf of bothnia': { 'centerPos': [0, 0] },
    'gulf of lyon': { 'centerPos': [0, 0] },
    'helgoland bight': { 'centerPos': [0, 0] },
    'ionian sea': { 'centerPos': [0, 0] },
    'irish sea': { 'centerPos': [0, 0] },
    'mid-atlantic ocean': { 'centerPos': [0, 0] },
    'north atlantic ocean': { 'centerPos': [0, 0] },
    'north sea': { 'centerPos': [0, 0] },
    'norwegian sea': { 'centerPos': [0, 0] },
    'skagerrak': { 'centerPos': [0, 0] },
    'tyrrhenian sea': { 'centerPos': [0, 0] },
    'western mediteranean': { 'centerPos': [0, 0] }
};

//not finished
var appreviations = [
    ['bohemia', 'boh'],
    ['budapest', 'bud'],
    ['galicia', 'gal'],
    ['trieste', 'tri'],
    ['tyrelia', 'tyr'],
    ['vienna', 'vie'],

    ['clyde', 'cly'],
    ['edinburgh', 'edi'],
    ['liverpool', 'liv'],
    ['london', 'lon'],
    ['wales', 'wal'],
    ['yorkshire', 'yor']
]

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

function tweet(txt, to) {
	
	//txt += '[' + String(Math.floor(Math.random() * 10000)) + ']';
	
    if (to != '')
    {
        txt = '@' + to + '' + txt + '[' + String(Math.floor(Math.random() * 1000)) + ']';
    }

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
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; }); // returns null if it doesn't exist
    if (error != null) { tweet('There is already a game with that name.', admin); return; }

    var save = emptyGameSave;
    save.admin = admin;
    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('You have created a game with name ' + gameName + '.', admin);
}

function addPlayerToGame(gameName, player, country) //add a player to a country
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error != null) { tweet('There is no game with name ' + gameName + '.', player); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.locked) { tweet('You cannot join game - it is locked!', player); return; }

    save.countries[country].players.push(player);

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('You have joined ' + gameName + ' as ' + country + '.', player);
}

function lockGame(gameName, commandFrom) //edit the lock state
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error != null) { tweet('There is no game with name ' + gameName + '.', commandFrom); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to lock ' + gameName + '.', commandFrom); return; }

    save.locked = true;

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('The game ' + gameName + ' has been locked.', commandFrom);
}

function deleteGame(gameName, commandFrom) //delete the save file
{
    //find out how to delete a json file
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error != null) { tweet('There is no game with name ' + gameName + '.'); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to delete ' + gameName + '.', commandFrom); return; }

    fs.unlinkSync(saveDirectory + gameName + '.json');

    tweet(gameName + ' has been deleted.', commandFrom);
}

function dumpError(err) {
	var json = JSON.stringify(err, null, 2);
	fs.writeFile("err.json", json);
}