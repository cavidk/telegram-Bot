const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TOKEN;



//token registration

const bot = new telegramBot(TOKEN, { polling: true});

bot.on('message', (message)=>{

   console.log(message);


});

//bot menu 

bot.onText(/\/start/, (msg) => {
   bot.sendMessage(msg.chat.id, "Welcome to my bot and Please choose an option from the menu:", {
     reply_markup: {
       keyboard: [
         ['Option 1', 'Option 2'],
         ['Option 3', 'Option 4'],
         ['Option 5']
       ]
     }
   });
 });


//  bot.onText(/Option 1/, (msg) => {
//    bot.sendMessage(msg.chat.id, "You chose Option 1");
//  });