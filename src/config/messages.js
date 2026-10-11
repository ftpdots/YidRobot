function startMessage(ctx) {
  return (
    `Hello, ${ctx.from.first_name}!\n\n` +
    `Your id: ${ctx.from.id}`
  );
}

function idMessage(ctx) {
  return (
    `id: <code>${ctx.from.id}</code>\n` +
    `name: <code>${ctx.from.first_name}</code>\n` +
    `username: @${ctx.from.username || "none"}`
  );
}

function sharedMessage(id) {
  return `ID: <code>${id}</code>`;
}

const about = `<b>About YidRobot</b>

A simple bot to get your Telegram ID.

• More features — view your ID and additional information.
• Help — learn how to use the bot.

<b>Version:</b> 1.0.0`;

const help = `<b>YidRobot Help</b>

<b>Commands:</b>
• /start — start the bot.
• /id — get your Telegram ID and access additional features.

<b>Support:</b> @ngro4`;

module.exports = {
  startMessage,
  idMessage,
  sharedMessage,
  about,
  help
};