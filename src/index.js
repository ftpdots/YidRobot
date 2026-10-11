require("dotenv").config();

const { Bot, InputFile } = require("grammy");
const path = require("path");

const log = require("./utils/logger.js");

const { idKeyboard, inlineStart } = require("./config/keyboards.js");

const {
  startMessage,
  idMessage,
  sharedMessage,
  about,
  help
} = require("./config/messages.js");

const registerCallbacks = require("./config/callbacks.js");
const registerAdmin = require("./config/admin.js");

const {
  saveUser
} = require("./utils/users.js");

const token = process.env.BOT_TOKEN;

if (!token) {
  log("error", "not_found_token");
  return;
}

const bot = new Bot(token);

bot.catch((err) => {
  log("error", "update_error", {
    userId: err.ctx.from?.id,
    error: err.error.message || String(err.error),
    stack: err.error.stack
  });
});

registerCallbacks(bot);
registerAdmin(bot);

bot.command("start", async (ctx) => {
  saveUser(ctx.from);

  await ctx.replyWithPhoto(
    new InputFile(
      path.join(__dirname, "../assets/yidrobotWelcome.webp")
    ),
    {
      caption: startMessage(ctx),
      parse_mode: "HTML",
      reply_markup: inlineStart
    }
  );

  log("info", "command_start", {
    userId: ctx.from.id
  });
});

bot.command("id", async (ctx) => {
  await ctx.reply(idMessage(ctx), {
    parse_mode: "HTML",
    reply_markup: idKeyboard
  });

  log("info", "command_id", {
    userId: ctx.from.id
  });
});

bot.command("help", async (ctx) => {
  await ctx.reply(help, {
    parse_mode: "HTML"
  });

  log("info", "command_help", {
    userId: ctx.from.id
  });
});

bot.command("about", async (ctx) => {
  await ctx.reply(about, {
    parse_mode: "HTML"
  });

  log("info", "command_about", {
    userId: ctx.from.id
  });
});

bot.on("message:chat_shared", async (ctx) => {
  const id = ctx.message.chat_shared.chat_id;

  await ctx.reply(sharedMessage(id), {
    parse_mode: "HTML"
  });

  log("info", "shared_chat", {
    userId: ctx.from.id
  });
});

bot.on("message:users_shared", async (ctx) => {
  const userIds = ctx.message.users_shared.user_ids;
  const id = userIds[0];

  await ctx.reply(sharedMessage(id), {
    parse_mode: "HTML"
  });

  log("info", "shared_user", {
    userId: ctx.from.id
  });
});

bot.api.setMyCommands([
  {
    command: "start",
    description: "Start the bot"
  },
  {
    command: "help",
    description: "Show help text"
  },
  {
    command: "about",
    description: "About Yidrobot"
  },
  {
    command: "id",
    description: "Get your Telegram ID"
  }
]).catch((error) => {
  log("error", "commands_registration_failed", {
    error: error.message || String(error),
    stack: error.stack
  });
});

bot.start({
  onStart: (botInfo) => {
    log("info", "bot_started", {
      botId: botInfo.id,
      username: botInfo.username
    });
  }
}).catch((error) => {
  log("error", "bot_start_failed", {
    error: error.message || String(error),
    stack: error.stack
  });
});