YidRobot

A simple Telegram bot for retrieving Telegram IDs.

Features

- Get your Telegram user ID
- Get IDs of other users
- Get group and channel IDs
- View basic user information
- Admin panel with user statistics
- User database and activity tracking
- Daily log files

Commands

Command| Description
"/start"| Start the bot
"/id"| Get your Telegram ID
"/help"| Show available commands
"/about"| About the bot

Admin Commands

Command| Description
"/admin"| Open the admin panel
"/stats"| View user statistics
"/users"| List registered users
"/user ID"| View user information
"/logs"| List log files
"/logsfile FILENAME"| Download a log file

Tech Stack

- Node.js
- grammY
- JSON storage
- File-based logging

Configuration

Create a ".env" file in the project root:

BOT_TOKEN=your_bot_token
ADMINS=123456789

- "BOT_TOKEN" — Telegram bot token.
- "ADMINS" — Telegram user IDs of administrators, separated by commas.

Run

npm install
node src/index.js

Storage

- User data: "data/users.json"
- Logs: "logs/bot-YYYY-MM-DD.log"

---

Made with Node.js.
