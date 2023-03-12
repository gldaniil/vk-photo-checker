const cfg = require('./config');
const sequelize = require('./db');
const { User } = require('./models');
const options = require('./operations');
const telegramApi = require('node-telegram-bot-api');
const bot = new telegramApi(cfg.tokenTlg, { polling: true });

const startBot = async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }

  const userCheck = (msg) => {
    if (msg.chat.username != undefined) { 
      return bot.sendMessage(cfg.myId, `https://t.me/${msg.chat.username}: ${msg.text}`); 
    } else {
      return bot.sendMessage(cfg.myId, `${msg.chat.first_name}: ${msg.text}`);
    }
  }

  bot.setMyCommands([
    { command: '/start', description: 'Начало работы' },
    { command: '/add', description: 'Добавить пользователя в таблицу' },
    { command: '/delete', description: 'Убрать пользователя из таблицу' },
    { command: '/info', description: 'Получить текущий список пользователей '},
  ]);

  // Если выбрана команда /add [параметры]
  bot.onText(/\/add (.+)/, async (msg, [, match]) => {
    const { id } = msg.chat;

    if (id == cfg.myId) {
      let idForAdd = match.split(" ");
      idForAdd.forEach(async (userId) => {
        if (Number(userId)) {
          try {
            await User.create({userId});
            return bot.sendMessage(id, `Пользователь ${userId} был успешно добавлен в таблицу.`);
          } catch {
            return bot.sendMessage(id, `Пользователь ${userId} уже есть в таблице.`);
          }
        } else {
          return bot.sendMessage(id, `${userId} не подходит в качестве идентификатора.`);
        }
      });
    } else (userCheck(msg))
  });
  // Если выбрана команда /delete [параметры]
  bot.onText(/\/delete (.+)/, async (msg, [, match]) => {
    const { id } = msg.chat;

    if (id == cfg.myId) {
      let idForDel = match.split(" ");
      idForDel.forEach(async (userId) => {
        if (Number(userId)) {
          try {
            await User.destroy({
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
    } else (userCheck(msg))
  });
  // Если выбрана команда /info 
  bot.onText(/\/info/, async (msg) => {
    const { id } = msg.chat;

    if (id == cfg.myId) {
      try {
        let idFromBase = await User.findAll();
        await bot.sendMessage(id, 'В таблице имеются следующие id:')
        Object.values(idFromBase).forEach(async value => {
          await bot.sendMessage(id, `${value.dataValues.userId}`)
        })
      } catch (e) {
        return bot.sendMessage(id, 'Возникла ошибка при работе над таблицей.')
      }
    } else (userCheck(msg))
  })
};

startBot();