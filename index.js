const cfg = require("./config");
const telegramApi = require("node-telegram-bot-api");
const sequelize = require('./db');
const userModel = require('./models');
const bot = new telegramApi(cfg.tokenTlg, { polling: true });

const startBot = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начало работы" },
    { command: "/add", description: "Добавить пользователя в таблицу" },
    { command: "/delete", description: "Убрать пользователя из таблицу" },
    { command: "/info", description: "Получить текущий список пользователей" },
  ]);
  // Если выбрана команда /add [параметры]
  bot.onText(/\/add (.+)/, async (msg, [, match]) => {
    const { id } = msg.chat;
    let idForAdd = match.split(" ");
    idForAdd.forEach(async (userId) => {
      if (Number(userId)) {
        try {
          await userModel.create({userId});
          return bot.sendMessage(id, `Пользователь ${userId} был успешно добавлен в таблицу.`);
        } catch {
          return bot.sendMessage(id, `Пользователь ${userId} уже есть в таблице.`);
        }
      } else {
        return bot.sendMessage(id, `${userId} не подходит в качестве идентификатора.`);
      }
    });
  });
  // Если выбрана команда /delete [параметры]
  bot.onText(/\/delete (.+)/, async (msg, [, match]) => {
    const { id } = msg.chat;
    let idForDel = match.split(" ");
    idForDel.forEach(async (userId) => {
      if (Number(userId)) {
        try {
          await userModel.destroy({
            where: {
              userId: `${userId}`,
            },
            force: true,
          }) 
            ? await bot.sendMessage(id, `Пользователь ${userId} был удалён из таблицы.`)
            : await bot.sendMessage(id, `Пользователь ${userId} отсутствует в таблице.`)
        } catch (e) {
          return bot.sendMessage(id, 'Возникла ошибка при удалении идентификатора.');
        }
      } else {
        return bot.sendMessage(id, `${userId} не определен как идентификатор.`);
      }
    });
  });

  // bot.on("message", async (msg) => {
  //   const chat = msg.chat;
  //   const text = msg.text;

  //   if (chat.id == cfg.myId) {

  //     if (text === "/start") {
  //       await bot.sendMessage(chat.id, `${text}`);
  //     }
  //     if (text === "/add") {
  //       await bot.sendMessage(chat.id, "Отправь id-пользователя")
  //       await bot.sendMessage(chat.id, `Пользователь добавлен`);
  //     }
  //     return bot.sendMessage(chat.id, "Я понимаю только команды из Меню 🥺")

  //   } else if (chat.last_name != undefined) {
  //     await bot.sendMessage(
  //       cfg.myId,
  //       `${chat.first_name} ${chat.last_name} (${chat.id}): ${text}`
  //     );

  //   } else {
  //     await bot.sendMessage(
  //       cfg.myId,
  //       `${chat.first_name} (${chat.id}): ${text}`
  //     );
  //   }
  // });
};

startBot();