const cfg = require("./config");

const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(cfg.tokenTlg, { polling: true });

bot.on("message", (msg) => {
  const chat = msg.chat;
  const text = msg.text;
  
  chat.id == cfg.chatId
    ? bot.sendMessage(chat.id, `${text}`)
    : chat.last_name != undefined
    ? bot.sendMessage(
        cfg.chatId,
        `${chat.first_name} ${chat.last_name} (${chat.id}): ${text}`
      )
    : bot.sendMessage(cfg.chatId, `${chat.first_name} (${chat.id}): ${text}`);
});
