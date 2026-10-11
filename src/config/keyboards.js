const { Keyboard, InlineKeyboard } = require("grammy");

const idKeyboard = new Keyboard()
  .requestUsers("User", 1, {
    max_quantity: 1,
    user_is_bot: false
  })
  .row()
  .requestChat("Group", 2, {
    chat_is_channel: false,
    bot_is_member: false
  })
  .row()
  .requestChat("Channel", 3, {
    chat_is_channel: true,
    bot_is_member: false
  })
  .resized();

const inlineStart = new InlineKeyboard()
  .text("More features", "features")
  .row()
  .text("About", "about")
  .text("Help", "help");

module.exports = {
  idKeyboard,
  inlineStart
};