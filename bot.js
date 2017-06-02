console.log('initializing...');

var fs = require('fs');
var path = require('path');
var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);
var stream = T.stream('user');

stream.on('tweet', tweetEvent);
stream.on('direct_message', directMessageEvent);
stream.on('follow', followEvent);
stream.on('unfollow', unfollowEvent);

var saveDirectory = __dirname + '/games/';
var date = new Date();

//https://medium.com/towards-data-science/making-a-replier-and-follow-bot-for-twitter-using-node-js-23e0ba8e4e4f

var emptyGameSave = {
    'locked': false,
    'admin': '',
    'countries': {
        'AUSTRO-HUNGARY': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['bohemia', 'budapest', 'galicia', 'trieste', 'tyrelia', 'vienna'],
            'armies': ['vienna', 'budapest'],
            'fleets': ['tyrelia'],
            'orders': []
        },
        'GREAT BRITAIN': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['clyde', 'edinburgh', 'liverpool', 'london', 'wales', 'yorkshire'],
            'armies': ['liverpool'],
            'fleets': ['edinburgh', 'london'],
            'orders': []
        },
        'FRANCE': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['brest', 'burgundy', 'gascony', 'marseilles', 'paris', 'picardy'],
            'armies': ['marseilles', 'paris'],
            'fleets': ['brest'],
            'orders': []
        },
        'GERMANY': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['berlin', 'kiel', 'munich', 'prussia', 'ruhr', 'silesia'],
            'armies': ['berlin', 'munich'],
            'fleets': ['kiel'],
            'orders': []
        },
        'ITALY': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['apulia', 'naples', 'piedmont', 'rome', 'tuscany', 'venice'],
            'armies': ['venice', 'rome'],
            'fleets': ['naples'],
            'orders': []
        },
        'RUSSIA': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['livonia', 'moscow', 'sevastopol', 'st petersburg', 'ukraine', 'warsaw'],
            'armies': ['warsaw', 'moscow'],
            'fleets': ['sevastopol', 'st petersburg'],
            'orders': []
        },
        'OTTOMANS': {
            'players': [],
            'color': [0, 0, 0, 0],
            'provinces': ['ankara', 'armenia', 'constantinople', 'smyrna', 'syria'],
            'armies': ['constantinople', 'smyrna'],
            'fleets': ['ankara'],
            'orders': []
        },
        'NEUTRAL': {
            'provinces': ['albania', 'belgium', 'bulgaria', 'finland', 'greece', 'holland', 'norway', 'north africa', 'portugal', 'rumania', 'serbia', 'spain', 'sweden', 'tunis']
        }

    },
    'resetAt': 24,
    'turnLength': 12,
    'countdown': 0
};

var emptyOrderFormat = {                 
    'province': '',
    'order': '',
    'affect': ''                 
};

//this var is rather messy but it will be extremely useful when generating a picture of the current game map. 
//the grayscale colors of each province will be in the color var for each province, and the center of the province (for placing armies and fleet icons) will be in the center pos var (probably in pixel coordinates)
//we won't be needing it probably
/*var provinces = {
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
    'sevastopol': { 'color': [0, 0, 0, 0], 'centerPos': [0, 0] },
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
};*/

var countries = [
    'AUSTRO-HUNGARY',
    'GREAT BRITAIN',
    'FRANCE',
    'ITALY',
    'GERMANY',
    'RUSSIA',
    'OTTOMANS'
]

var abbreviations = [
    ['bohemia', 'boh', 'bhm'],
    ['budapest', 'bud', 'bdp'],
    ['galicia', 'gal', 'glc'],
    ['trieste', 'tri', 'trs'],
    ['tyrelia', 'tyr'],
    ['vienna', 'vie'],

    ['clyde', 'cly'],
    ['edinburgh', 'edi'],
    ['liverpool', 'liv'],
    ['london', 'lon'],
    ['wales', 'wal'],
    ['yorkshire', 'yor'],
	
	['brest', 'bre'],
	['burgundy', 'bur'],
	['gascony', 'gas']
	['marseilles', 'mar'],
	['paris', 'par'],
	['picardy', 'pic'],
	
	['berlin', 'ber'],
	['kiel', 'kie']
	['munich', 'mun'],
	['prussia', 'pru']
	['ruhr', 'ruh'],
	['silesia', 'sil'],
	
	['apulia', 'apu', 'apl'],
    ['naples', 'nap'],
    ['piedmont', 'pie'],
    ['rome', 'rom'],
    ['tuscany', 'tus', 'tsc'],
    ['venice', 'ven', 'vnc'],
	
	['livonia', 'liv'],
    ['moscow', 'mos'],
    ['sevastopol', 'sev'],
    ['st petersburg', 'stp'],
    ['ukraine', 'ukr'],
    ['warsaw', 'war'],

    ['ankara', 'ank'],
    ['armenia', 'arm'],
    ['constantinople', 'con'],
    ['smyrna', 'smy'],
    ['syria', 'syr'],

    ['albania', 'alb'],
    ['belgium', 'bel'],
    ['bulgaria', 'bul'],
    ['finland', 'fin'],
    ['greece', 'gre', 'grc'],
    ['holland', 'hol', 'holl'],
    ['norway', 'nor', 'norw'],
    ['north africa', 'nafr', 'naf'],
    ['portugal', 'por', 'prtg'],
    ['rumania', 'rum'],
    ['serbia', 'ser', 'serb'],
    ['spain', 'spa', 'spn'],
    ['sweden', 'swe', 'swd'],
    ['tunis', 'tun', 'tns'],

    ['adriatic sea', 'adr'],
    ['aegean sea', 'aeg'],
    ['baltic sea', 'bal'],
    ['barents sea', 'bar'],
    ['black sea', 'bla'],
    ['eastern mediterranean', 'eas', 'emd'],
    ['english channel', 'eng'],
    ['gulf of bothnia', 'bot', 'gob'],
    ['gulf of lyon', 'lyo', 'lyn',  'gol'],
    ['helgoland bight', 'hel', 'hlg', 'hlb'],
    ['ionian sea', 'ion'],
    ['irish sea', 'iri'],
    ['mid-atlantic ocean', 'mid', 'mat'],
    ['north atlantic ocean', 'nat'],
    ['north sea', 'nor', 'nth'],
    ['norwegian sea', 'nrg', 'nrw'],
    ['skagerrak', 'ska'],
    ['tyrrhenian sea', 'tyh'],
    ['western mediteranean', 'wes', 'wmd']
]

var endTweetChars = ['.', ',', '?'];

var runningGames = [];

var selectedGames = [

]

start();


function start()
{
    console.log('The Diplomacy Bot has started');

    //run();
}

function run()
{
    var timeChange = 0;
    var lastTime = date.getHours() + (date.getMinutes() / 60);
    
    while (true)
    {
        timeChange = date.getHours() + (date.getMinutes() / 60) - lastTime;
        if (timeChange < 0) { timeChange += 24; }
        lastTime = date.getHours() + (date.getMinutes() / 60);

        for (var i = 0; i < runningGames.length; i++) {
            var error = null;

            fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
            if (error == null) { console.log('There was an error in \'run()\' - ' + runningGames[i] + ' is not a valid save.'); runningGames.slice(i); }
			else 
			{
				
				var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

				save.countdown -= timeChange;

				if (save.countdown == 0)
				{
				    //do turn calcs and stuff
				    save.countdown = save.turnLength;
				}
				else if (save.countdown == (1/60))
				{
				    tweetTimeWarnings(runningGames[i], save, '1 minute');
				}
				else if (save.countdown == (5/60))
				{
				    tweetTimeWarnings(runningGames[i], save, '5 minutes');
				}
				else if (save.countdown == (1/6))
				{
				    tweetTimeWarnings(runningGames[i], save, '10 minutes');
				}
				else if (save.countdown == (1/2))
				{
				    tweetTimeWarnings(runningGames[i], save, '30 minutes');
				}
				else if (save.countdown == 1)
				{
				    tweetTimeWarnings(runningGames[i], save, '1 hour');
				}

				var jsonSave = JSON.stringify(save, null, 2);
				fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);
			}

        }
    }
}

function tweetEvent(eventMsg) {
	
    var replyTo = eventMsg.in_reply_to_screen_name; //to
    //var personFrom = eventMsg.personFrom; 
	var text = eventMsg.text;
	var senderUserName = eventMsg.user.screen_name; //from, @name
	var senderName = eventMsg.user.name; //from, name

	if(replyTo === 'JohnLockeBot')
	{
	    console.log('The bot has been tweeted by ' + senderUserName + ' - \'' + text + '\'');
		
		text = text.replace(/@JohnLockeBot /g, '');
		
	    //var split = text.split('[');
	    //text = split[0];
	    //var split2 = split[1].split(']');
	    //text += split2[1];

	    for (var i = 0; i < endTweetChars.length; i++)
	    {
	        text = text.split(endTweetChars[i])[0];
	    }

	    console.log('Recieved tweet: ' + eventMsg.text);

	    scanForCommands(text, senderUserName);
	}

}

function directMessageEvent(directMsg)
{
    var text = directMsg.direct_message.text;
    var from = directMsg.direct_message.sender.screen_name;

    //console.log('Recieved direct message.');

    //var json = JSON.stringify(directMsg, null, 2);
    //fs.writeFile("dmtest.json", json);

    console.log('Recived direct message from ' + from + ': \'' + text + '\'.');

    for (var i = 0; i < endTweetChars.length; i++) {
        text = text.split(endTweetChars[i])[0];
    }

    scanForOrders(text, from);
}

function followEvent(eventMessage)
{
    console.log('Followed.');

    tweet('Thank you for following me!', eventMessage.source.screen_name);

    var json = JSON.stringify(eventMessage, null, 2);
    fs.writeFile("ftest.json", json);
}

function unfollowEvent(eventMessage)
{
    console.log('Unfollowed.');

    var json = JSON.stringify(eventMessage, null, 2);
    fs.writeFile("uftest.json", json);
}

function tweet(txt, personTo) {
	
	//txt += '[' + String(Math.floor(Math.random() * 10000)) + ']';
	
    if (personTo != '')
    {
        txt = '@' + personTo + ' ' + txt + ' [' + String(Math.floor(Math.random() * 1000)) + ']';
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
		else{
			console.log('Sent tweet: \'' + txt + '\'');		
		}
	}
}

function directMessage(txt, personTo)
{
    if (personTo == '') {
        return;
    }

    var message = {
        screen_name: personTo,
        text: txt
    }

    T.post('direct_messages/new', message, messaged);

    function messaged(err, data, response) {
        if (err) {
            console.log('Somthing went wrong when trying to tweet! Dumping to err file.');
            dumpError(err);
        }
        else {
            console.log('Sent direct message to ' + personTo + ': \'' + txt + '\'.');
        }
    }
}

function scanForCommands(twt, personFrom)
{
    //twt = twt.replace('start game ', 'create game ');
    twt = twt.replace('make game ', 'create game ');

    twt = twt.replace('exit game ', 'quit game ');

    twt = twt.replace('close game ', 'lock game ');

    twt = twt.replace('begin game ', 'start game ');

    twt = twt.replace('end game ', 'delete game ');

    twt = twt.replace('resetTime ', 'resetAt ');
    twt = twt.replace('reset time ', 'resetAt ');

    twt = twt.replace('turn length ', 'turnLength ');


    if (twt.includes('create game ')) //create game
    {
        var context = twt.replace('create game ', '');
        createGame(context, personFrom);
    }
    else if (twt.includes('join game ')) //join game
    {
        var context = twt.replace('join game ', '');
        var gameName = '';
        var country = '';

        for (var i = 0; i < countries.length; i++) {
            if (context.includes(countries[i])) {
                gameName = context.replace(countries[i], '');
				gameName = gameName.replace(' ', '');
                country = countries[i];
                break;
            }
        }

        addPlayerToGame(gameName, personFrom, country);
    }
    else if (twt.includes('quit game ')) //quit game
    {
        var context = twt.replace('quit game ', '');
        removePlayerFromGame(context, personFrom);
    }
    else if (twt.includes('lock game ')) //lock game
    {
        var context = twt.replace('lock game ', '');
        lockGame(context, personFrom);
    }
    else if (twt.includes('start game '))
    {
        var context = twt.replace('start game ');
        startGame(context, personFrom);
    }
    else if (twt.includes('delete game ')) //delete game
    {
        var context = twt.replace('delete game ', '');
        deleteGame(context, personFrom);
    }
    else if (twt.includes('resetAt '))
    {
        var split = (twt.replace('resetAt ', '')).split(' ');
        var num = split[0]; var game = split[1];

        setResetAt(game, num, personFrom);
    }
    else if (twt.includes('turnLength ')) {
        var split = (twt.replace('turnLength ', '')).split(' ');
        var num = split[0]; var game = split[1];

        setTurnLength(game, num, pesonFrom);
    }
    else if (twt.includes('abbreviations '))
    {
        var context = twt.replace('abbreviations ', '');
        tweetAppreviations(context, personFrom);
    }
}

function scanForOrders(twt, personFrom)
{
    //twt = twt.replace('start game ', 'create game ');


    if (twt.includes('select game ')) //create game
    {
        var context = twt.replace('select game ', '');

        selectGame(context, personFrom);
    }
}

function createGame(gameName, admin)
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; }); // returns null if it doesn't exist
    if (error != null) { tweet('There is already a game with the name \'' + gameName + '\'. Please choose another name for your game.', admin); return; }

    var save = emptyGameSave;
    save.admin = admin;
    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('You have created a game with name \'' + gameName + '\'. Tell your friends so they can join!\nYou must set the turnLength and resetAt time before starting.', admin);
}

function isPlayerInGame(gameName, player)
{
	var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.', player); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));
	
	for (var c = 0; c < countries.length; c++)
	{
		for (var i = 0; i < save.countries[countries[c]].players.length; i++)
		{
			if (player == save.countries[countries[c]].players[i])
            {
                return true;
            }
		}
	}
	
	return false;
}

function addPlayerToGame(gameName, player, country) //add a player to a country
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.', player); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.locked) { tweet('You cannot join game \'' + gameName + '\' - it is locked!', player); return; }
	
	if (isPlayerInGame(gameName, player)) { tweet('You could not join game \'' + gameName + '\' becuase you are already in it.', player); return; }

    if (save.countries[country] == undefined) { tweet('That is not a valid country!\nPlease join \'AUSTRO-HUNGARY\', \'GREAT BRITAIN\', \'FRANCE\', \'ITALY\', \'GERMANY\', \'RUSSIA\', or \'OTTOMANS\'.', player); return; }

    save.countries[country].players.push(player);

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('You have joined game \'' + gameName + '\' as \'' + country + '\'.', player);
}

function removePlayerFromGame(gameName, player)
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.', player); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));
	
	if (!isPlayerInGame(gameName, player)) { tweet('You are not in game \'' + gameName + '\', so you cannot quit.', player); return; }

    for (var c = 0; c < countries.length; c++)
    {
        for (var i = 0; i < save.countries[countries[c]].players.length; i++)
        {
            if (player == save.countries[countries[c]].players[i])
            {
                save.countries[countries[c]].players.slice(i);
                break;
            }
        }
    }

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('You have quit the game \'' + gameName + '\'.', player);

}

function lockGame(gameName, commandFrom) //edit the lock state
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.', commandFrom); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to lock game \'' + gameName + '\'. You are not its admin.', commandFrom); return; }

    save.locked = true;

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('The game \'' + gameName + '\' has been locked. No more players may join it.', commandFrom);
}

function startGame(gameName, commandFrom)
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.'); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to start game \'' + gameName + '\'. You are not the admin.', commandFrom); return; }

    runningGames.push(gameName);

    tweet('Game \'' + gameName + '\' has started. You are the admin.', commandFrom);
    for (var i = 0; i < countries.length; i++)
    {
        for (var i2 = 0; i2 < save.countries[countries[i]].players.length; i2++)
        {
            tweet('Game \'' + gameName + '\' has started. You are playing as \'' + countries[i] + '\'.', save.countries[countries[i]].players[i]);
        }
    }

    save.nextTurnEnd = save.resetAt;

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);
}

function deleteGame(gameName, commandFrom) //delete the save file
{
    var error = null;
	
    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.'); return; }
	
    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));
	
    if (save.admin != commandFrom) { tweet('You do not have the authority to delete game \'' + gameName + '\'. You are not the admin.', commandFrom); return; }

    runningGames.splice(runningGames.indexOf(gameName), 1);

    fs.unlinkSync(saveDirectory + gameName + '.json');	
    tweet('Game \'' + gameName + '\' has been deleted. Thank you for playing!', commandFrom);
    for (var i = 0; i < countries.length; i++) {
        for (var i2 = 0; i2 < save.countries[countries[i]].players.length; i2++) {
            tweet('Game \'' + gameName + '\' has ended. Thank you for playing!', save.countries[countries[i]].players[i]);
        }
    }
}

function setResetAt(gameName, num, commandFrom)
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.'); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to set resetAt in game \'' + gameName + '\'. You are not the admin.', commandFrom); return; }

    var set = parseFloat(num.replace(/[^\d.]/g, ''));
    
    if (set == NaN || set == null) { console.log('Could not parse float: ' + num); tweet('There was a problem with your command. ' + num + ' is not a number, so resetAt cannot be set to it.', commandFrom); return;}

    save.resetAt = set;

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('resetAt of game \'' + gameName + '\' was successfully set to ' + num + '.', commandFrom)
}

function setTurnLength(gameName, num, commandFrom)
{
    var error = null;

    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { tweet('There is no game with name \'' + gameName + '\'.'); return; }

    var save = JSON.parse(fs.readFileSync(saveDirectory + gameName + '.json'));

    if (save.admin != commandFrom) { tweet('You do not have the authority to set turnLength in game \'' + gameName + '\'. You are not the admin.', commandFrom); return; }

    var set = parseFloat(num.replace(/[^\d.]/g, ''));

    if (set == NaN || set == null) { console.log('Could not parse float: ' + num); tweet('There was a problem with your command. ' + num + ' is not a number, so turnLength cannot be set to it.', commandFrom); return; }

    if (set < (1 / 2)) { tweet('There was a problem with your command. ' + num + ' is too small a length of time, so turnLength cannot be set to it.', commandFrom); return; }

    save.turnLength = set;

    var jsonSave = JSON.stringify(save, null, 2);

    fs.writeFileSync(saveDirectory + gameName + '.json', jsonSave);

    tweet('turnLength of game \'' + gameName + '\' was successfully set to ' + num + '.', commandFrom)
}

function selectGame(gameName, commandFrom)
{
    var error = null;
    fs.access(saveDirectory + gameName + '.json', fs.constants.F_OK, function (err) { error = err; });
    if (error == null) { directMessage('There is no game with name \'' + gameName + '\'.', commandFrom); return; }

    var alreadySet = false;
    for (var i = 0; i < selectedGames.length; i++) {
        if (selectedGames[i][0] == commandFrom) {
            selectedGames[i][1] = gameName;
            alreadySet = true;
            break;
        }
    }
    if (!alreadySet) {
        selectedGames.push([commandFrom, gameName]);
    }

    directMessage('You can now enter orders for game \'' + gameName + '\'.', commandFrom);
}

function tweetAppreviations(province, commandFrom)
{
    var str = stringifyAppreviations(province);
    if (str == null) { tweet('There is no province named \'' + province + '\'.', commandFrom); return; }

    tweet(str, commandFrom);
}

function tweetTimeWarnings(gameName, save, timeLeft)
{
    for (var c = 0; c < countries.length; c++)
    {
        for (var p = 0; p < save.countries[countries[c]].players.length; p++)
        {
            tweet('The next turn for game \'' + gameName + '\' ends in ' + timeLeft + '. Make sure to turn in your orders!', save.countries[countries[c]].players[p]);
        }
    }
}

function stringifyAppreviations(province)
{
    //find array num
    var arrayNum = undefined;
    for (var i = 0; i < abbreviations.length; i++)
    {
        if (abbreviations[i][0] == province)
        {
            arrayNum = i;
            break;
        }
    }

    //test to see if exists
    if (arrayNum == undefined)
    {
        //return 'ERROR: No such province.';
        return null;
    }

    var string = '';

    string += 'Abbreviations for \'' + abbreviations[arrayNum][0] + '\':' + '\n';
    for (var i = 1; i < abbreviations[arrayNum].length; i++)
    {
        if (i != 1) string += '\n';
        string += String(i) + ') ' + abbreviations[arrayNum][i];
    }

    return string;
}

function dumpError(err) 
{
	var json = JSON.stringify(err, null, 2);
	fs.writeFile("err.json", json);
}