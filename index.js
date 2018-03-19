'use strict';
const BootBot = require('bootbot');
const fetch = require('node-fetch');
const config = require('config');


const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=`;
const JOKEZ_URL = `https://api.chucknorris.io/jokes/random`;
const DRINK_URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

const bot = new BootBot({
  accessToken: config.get('access_token'),
  verifyToken: config.get('verify_token'),
  appSecret: config.get('app_secret')
});

bot.setGreetingText("Hello. Use 'drink', 'norris' or 'gif <name>'!")

bot.hear(['hello', 'hi', 'hey'], (payload, chat) => {
  console.log(payload.sender);
  //console.log(chat);
  chat.say('Hello there!');
});

bot.hear(/gif (.*)/i, (payload, chat, data) => {
  const query = data.match[1];
  chat.say('Searching...');
  fetch(GIPHY_URL + query)
    .then(res => res.json())
    .then(json => {
      chat.say({
        attachment: 'image',
        url: json.data.image_url
      }, {
          typing: true
        });
    });
});

bot.hear(/(.*)norris(.*)/i, (payload, chat, data) => {
  chat.say('New joke incoming!');
  fetch(JOKEZ_URL)
    .then(res => res.json())
    .then(json => {
      chat.say(json.value)
    })
})



bot.hear(/(.*)drink(.*)/i, (payload, chat, data) => {
  chat.say("Let's get some drinks!");
  fetch(DRINK_URL)
    .then(res => res.json())
    .then(json => {
      var ingr = '';
      for (var i = 1; i < 15; i++) {
        var instr = "strIngredient" + i;
        var amount = "strMeasure" + i;
        if(json.drinks[0][instr] != ''){
        ingr = ingr + json.drinks[0][instr] + " " + json.drinks[0][amount] +'\n';}
      }
      chat.say(
        "Drink: " + json.drinks[0].strDrink + '\n\n' +
        "Ingredients: \n" + ingr + '\n'+
        "Instruction: \n" + json.drinks[0].strInstructions);
        chat.say({
          attachment: 'image',
          url: json.drinks[0].strDrinkThumb
        })
    })
  
})

bot.start();