const cfg = require("./config");

const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(cfg.tokenTlg, { polling: true });

const startBot = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало работы" },
    { command: "/add", description: "Добавить пользователя в список" },
    { command: "/delete", description: "Убрать пользователя из списка" },
    { command: "/info", description: "Получить текущий спиок пользователей" },
  ]);

  bot.on("message", async (msg) => {
    const chat = msg.chat;
    const text = msg.text;

    chat.id == cfg.chatId
      ? await bot.sendMessage(chat.id, `${text}`)
      : chat.last_name != undefined
      ? await bot.sendMessage(
          cfg.chatId,
          `${chat.first_name} ${chat.last_name} (${chat.id}): ${text}`
        )
      : await bot.sendMessage(
          cfg.chatId,
          `${chat.first_name} (${chat.id}): ${text}`
        );
  });
};
