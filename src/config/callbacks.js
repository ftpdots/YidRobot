const { idMessage, about, help } = require("./messages.js");
const { idKeyboard } = require("./keyboards.js");

const log = require("../utils/logger.js");

function registerCallbacks(bot) {
  bot.callbackQuery("features", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.reply(idMessage(ctx), {
      parse_mode: "HTML",
      reply_markup: idKeyboard
    });

    log("info", "callback_features", {
      userId: ctx.from.id
    });
  });

  bot.callbackQuery("about", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.reply(about, {
      parse_mode: "HTML"
    });

    log("info", "callback_about", {
      userId: ctx.from.id
    });
  });

  bot.callbackQuery("help", async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.reply(help, {
      parse_mode: "HTML"
    });

    log("info", "callback_help", {
      userId: ctx.from.id
    });
  });
}

module.exports = registerCallbacks;