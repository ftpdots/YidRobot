const fs = require("fs");
const path = require("path");
const { InputFile } = require("grammy");

const {
  getUser,
  getUsers,
  getUserCount
} = require("../utils/users.js");

const log = require("../utils/logger.js");

const logsDir = path.join(__dirname, "..", "..", "logs");

const adminIds = (process.env.ADMINS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

function isAdmin(ctx) {
  return adminIds.includes(String(ctx.from?.id));
}

function registerAdmin(bot) {
  bot.command("admin", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    await ctx.reply(
      "YidRobot Admin Panel\n\n" +
      "/stats — user statistics\n" +
      "/users — list users\n" +
      "/user ID — user information\n" +
      "/logs — list log files\n" +
      "/logsfile FILENAME — download a log"
    );

    log("info", "admin_opened", {
      userId: ctx.from.id
    });
  });

  bot.command("stats", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    await ctx.reply(`Total users: ${getUserCount()}`);

    log("info", "admin_stats", {
      userId: ctx.from.id
    });
  });

  bot.command("users", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    const users = getUsers();

    if (users.length === 0) {
      return ctx.reply("No registered users.");
    }

    const list = users.slice(0, 20).map((user) => {
      const name = user.firstName || "Unknown";
      const username = user.username
        ? `@${user.username}`
        : "No username";

      return `${name} | ${username} | ${user.id}`;
    });

    await ctx.reply(
      `Users: ${users.length}\n\n` +
      list.join("\n") +
      (users.length > 20
        ? "\n\nShowing first 20 users."
        : "")
    );

    log("info", "admin_users", {
      userId: ctx.from.id,
      totalUsers: users.length
    });
  });

  bot.command("user", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    const id = String(ctx.match || "").trim();

    if (!/^\d+$/.test(id)) {
      return ctx.reply("Usage: /user ID");
    }

    const user = getUser(id);

    if (!user) {
      return ctx.reply("User not found.");
    }

    await ctx.reply(
      `ID: ${user.id}\n` +
      `Name: ${user.firstName || "Unknown"}\n` +
      `Username: ${user.username ? `@${user.username}` : "None"}\n` +
      `First seen: ${user.firstSeen}\n` +
      `Last seen: ${user.lastSeen}`
    );

    log("info", "admin_user_viewed", {
      adminId: ctx.from.id,
      targetUserId: user.id
    });
  });

  bot.command("logs", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    if (!fs.existsSync(logsDir)) {
      return ctx.reply("Log directory not found.");
    }

    const files = fs.readdirSync(logsDir)
      .filter((file) => /^bot-\d{4}-\d{2}-\d{2}\.log$/.test(file))
      .sort()
      .reverse();

    if (files.length === 0) {
      return ctx.reply("No log files found.");
    }

    const list = files.map((file) => {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const count = content.split("\n").filter(Boolean).length;

      return `${file} — ${count} entries`;
    });

    await ctx.reply(
      `Log files: ${files.length}\n\n` +
      list.join("\n") +
      "\n\nUse /logsfile FILENAME to download a log."
    );

    log("info", "admin_logs_list", {
      userId: ctx.from.id,
      filesCount: files.length
    });
  });

  bot.command("logsfile", async (ctx) => {
    if (!isAdmin(ctx)) {
      return ctx.reply("Access denied.");
    }

    const fileName = String(ctx.match || "").trim();

    if (!/^bot-\d{4}-\d{2}-\d{2}\.log$/.test(fileName)) {
      return ctx.reply(
        "Usage: /logsfile bot-YYYY-MM-DD.log"
      );
    }

    const filePath = path.join(logsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return ctx.reply("Log file not found.");
    }

    try {
      await ctx.replyWithDocument(
        new InputFile(filePath, fileName)
      );

      log("info", "admin_log_downloaded", {
        userId: ctx.from.id,
        fileName
      });
    } catch (error) {
      log("error", "admin_log_send_failed", {
        userId: ctx.from.id,
        fileName,
        error: error.message
      });

      await ctx.reply("Failed to send log file.");
    }
  });
}

module.exports = registerAdmin;