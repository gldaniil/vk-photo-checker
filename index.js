const cfg = require('./config');
const telegramApi = require('node-telegram-bot-api');
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
    { command: '/start', description: 'Начало работы' },
    { command: '/add', description: 'Добавить пользователя в таблицу' },
    { command: '/delete', description: 'Убрать пользователя из таблицу' },
    { command: '/info', description: 'Получить текущий список пользователей '},
  ]);
  bot.on("message", async (msg) => {

  })
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
  // Если выбрана команда /info 
  bot.onText(/\/info/, async (msg) => {
    const { id } = msg.chat;
    try {
      let idFromBase = await userModel.findAll();
      await bot.sendMessage(id, 'В таблице имеются следующие id:')
      Object.values(idFromBase).forEach(async value => {
        await bot.sendMessage(id, `${value.dataValues.userId}`)
      })
    } catch (e) {
      return bot.sendMessage(id, 'Возникла ошибка при работе над таблицей.')
    }
  })
};

startBot();