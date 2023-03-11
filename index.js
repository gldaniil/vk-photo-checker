const cfg = require("./config");

const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(cfg.tokenTlg, { polling: true });

const startBot = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало работы" },
    { command: "/add", description: "Добавить пользователя в БД" },
    { command: "/delete", description: "Убрать пользователя из БД" },
    { command: "/info", description: "Получить текущий список пользователей" },
  ]);

  bot.on("message", async (msg) => {
    const chat = msg.chat;
    const text = msg.text;

    if (chat.id == cfg.myId) {
      if (text === "/start") {
        await bot.sendMessage(chat.id, `${text}`);
      }
    } else if (chat.last_name != undefined) {
      await bot.sendMessage(
        cfg.myId,
        `${chat.first_name} ${chat.last_name} (${chat.id}): ${text}`
      );
    } else {
      await bot.sendMessage(
        cfg.myId,
        `${chat.first_name} (${chat.id}): ${text}`
      );
    }
  });
};

startBot();
