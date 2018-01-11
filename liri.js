// access the keys and tokens we need to make the app work 

var keys = require ("./keys.js") ;
var Twitter = require ("twitter") ;
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require("fs");

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});



function startLiri (){

	console.log("Welcome to LIRI!")

	inquirer.prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "list",
	      message: "What would you like LIRI to do?",
	      name: "options",
	      choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
	    }, 
	    {
	     type: "input",
         message: "Input your search term. If search term isn't required, press ENTER.",
         name: "query" 
	    }

	  ]).then(function(answer) {
	  	
	    if (answer.options === "my-tweets") {	
	      	if (answer.query.length === 0) {
	      		tweetGrab("komorebi_girl")
	      	}
	      	else {
	      		tweetGrab(answer.query)
	      	}

	    }

	    else if (answer.options === "spotify-this-song") {

	    	if (answer.query.length === 0) {
	      		musicGrab("The Sign")
	      	}
	      	else {
	      		musicGrab(answer.query)
	      	}
	    }

	    else if (answer.options === "movie-this") {
	    	if (answer.query.length === 0) {
	      		movieGrab("Mr Nobody")
	      	}
	      	else {
	      		movieGrab(answer.query)
	      	}
	    }

	    else if (answer.options === "do-what-it-says") {
	    	fufillCommand();
	    }

	 });

}



function fufillCommand () {
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  else {
	  	  // We will then print the contents of data
		  console.log(data);

		  // Then split it by commas (to make it more readable)
		  var dataArr = data.split(",");

		  // We will then re-display the content as an array for later use.
		  console.log(dataArr);

		  if (dataArr[0] === "spotify-this-song") {
		  	musicGrab(dataArr[1]);
		  }

		  else if (dataArr[0] === "movie-this"){
		  	movieGrab(dataArr[1]);
		  }

		  else if (dataArr[0] === "my-tweets") {
		  	tweetGrab(dataArr[1]);
		  }
		  

	 }

	  });
}



function tweetGrab (handle){
	// whatever is written in as handle cannot be in quotes or this function wont work
	var params = {screen_name: handle};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

	  if (error) {
	    console.log(error);
	  }
	  else {

	  	for (var i = 0; i < tweets.length; i++) {
	  		console.log("The User you searched tweeted this on: "+ tweets[i].created_at);
	  		console.log("Text Summary: " + tweets[i].text);
	  		console.log("===========================================")
	  	}
	  }

	});
}



function musicGrab (song){
	  spotify.search({ type: 'track', query: song, limit: 10 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 
	  else {
	    for (var i = 0; i < data.tracks.items.length; i++) {
	 	
		 	console.log("Song Name: " + data.tracks.items[i].name);
		 	console.log("Artist: " + data.tracks.items[i].artists[0].name);
		 	console.log("Preview URL: " + data.tracks.items[i].preview_url);
		 	console.log("Album: " + data.tracks.items[i].album.name);
		 	console.log("===========================================")

	 	}
	  }


	});

}

function movieGrab (search){

	var url = "http://www.omdbapi.com/?t="+search+"&plot=full&apikey="+keys.omdbkey.apikey;

	request(url, function (error, response, body) {
   		console.log("Movie Title: " + JSON.parse(body).Title); 
   		console.log("Year of Release: " + JSON.parse(body).Year);
   		console.log(JSON.parse(body).Ratings[0].Source);
   		console.log("Rating: "+ JSON.parse(body).Ratings[0].Value);
   		console.log(JSON.parse(body).Ratings[1].Source);
   		console.log("Rating: "+ JSON.parse(body).Ratings[1].Value);
   		console.log("Country: " + JSON.parse(body).Country);
   		console.log("Language: " + JSON.parse(body).Language);
   		console.log("Actors: " + JSON.parse(body).Actors);
   		console.log("Plot Summary: " + JSON.parse(body).Plot);
   	})

}

startLiri();
