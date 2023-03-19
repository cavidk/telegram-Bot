import mongoose from 'mongoose';
import Telegraf from 'telegraf';

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/telegram_bot_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
});

// Bot setup
const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command
bot.start(async (ctx) => {
  await ctx.reply('Hi! Please tell me your first name.');
  ctx.session.state = 'FIRST_NAME';
});

// Message handler
bot.on('message', async (ctx) => {
  const { state } = ctx.session;

  switch (state) {
    case 'FIRST_NAME':
      // Get the user's first name and ask for their last name
      ctx.session.user = { firstName: ctx.message.text };
      await ctx.reply('Great! Now, please tell me your last name.');
      ctx.session.state = 'LAST_NAME';
      break;
    case 'LAST_NAME':
      // Get the user's last name and ask for their email
      ctx.session.user.lastName = ctx.message.text;
      await ctx.reply('Thanks! What is your email address?');
      ctx.session.state = 'EMAIL';
      break;
    case 'EMAIL':
      // Validate the user's email and ask for their phone number
      const email = ctx.message.text;
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        await ctx.reply('Invalid email address. Please try again.');
        return;
      }
      ctx.session.user.email = email;
      await ctx.reply('What is your phone number?');
      ctx.session.state = 'PHONE';
      break;
    case 'PHONE':
      // Save the user's information and provide the main menu
      const phone = ctx.message.text;
      if (!/^\d+$/.test(phone)) {
        await ctx.reply('Invalid phone number. Please try again.');
        return;
      }
      ctx.session.user.phone = phone;
      const user = new User(ctx.session.user);
      await user.save();
      await ctx.reply(
        'Registration complete!',
        new Telegraf.Markup()
          .keyboard(['My Profile', 'Settings'])
          .resize()
          .oneTime()
          .extra()
      );
      ctx.session.state = 'MAIN_MENU';
      break;
    case 'MAIN_MENU':
      // Handle the main menu buttons
      switch (ctx.message.text) {
        case 'My Profile':
          // Retrieve the user's information and send it to the user
          const user = await User.findOne({
            firstName: ctx.session.user.firstName,
            lastName: ctx.session.user.lastName,
          });
          if (!user) {
            await ctx.reply('User not found.');
            return;
          }
          await ctx.replyWithMarkdown(
            `*Full Name:* ${user.firstName} ${user.lastName}\n*Email:* ${user.email}\n*Phone:* ${user.phone}`
          );
          break;
        case 'Settings':
          // Provide the option to delete the account
          await ctx.reply(
            'Are you sure you want to delete your account?',
            new Telegraf.Markup()
              .inlineKeyboard([
                [
                  {
                    text: 'Yes',
                    callback_data: 'delete',
                  },
                  {
                    text: 'No',
                    callback_data: 'cancel',
                  },
                ],
              ])
              .extra()
          );
          break;
        default:
          await ctx.reply
