
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('5971983153:AAFLCNSYZWZoi_VI1zgs2VjDpiZMzesyDsI', { polling: true });

bot.on('message', (message)=>{

   console.log(message);


});



bot.onText(/\/start/, (msg) => {
   bot.sendMessage(msg.chat.id, 'Hi! What is your first name?', {
     reply_markup: {
       force_reply: true,
     },
   });
 });

 
 bot.onReplyToMessage((msg) => {
   if (msg.text) {
     bot.sendMessage(
       msg.chat.id,
       `Nice to meet you, ${msg.text}. What is your last name?`,
       {
         reply_markup: {
           force_reply: true,
         },
       }
     );
   }
 });
 



//bot menu 

// bot.onText(/\/start/, (msg) => {
//    bot.sendMessage(msg.chat.id, "Welcome to my bot and Please choose an option from the menu:", {
//      reply_markup: {
//        keyboard: [
//          ['Option 1', 'Option 2'],
//          ['Option 3', 'Option 4'],
//          ['Option 5']
//        ]
//      }
//    });
//  });


//  bot.onText(/Option 1/, (msg) => {
//    bot.sendMessage(msg.chat.id, "You chose Option 1");
//  });