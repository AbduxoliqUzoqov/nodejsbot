const TelegramBot = require('node-telegram-bot-api');

const express = require('express');
const token = '8143064971:AAELnny51r2K6SlTbEmylGfRajmMZ3aF830';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const adminId = "6456220643";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello")
});
bot.setWebHook("https://nodejsbot-mu.vercel.app/api/${token}");

app.post(`/api/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
const botstart = () => {
  bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text == "/start") {
      bot.sendMessage(chatId, 'assalomu alaykum');
      bot.sendMessage(adminId, `Botimizda yangi azo\n✔ ${msg.chat.first_name} botga start bosdi`);
    } else if (text == "/join") {
      bot.sendMessage(chatId, "ushbu kanalga obuna boling");
    } else if (text == "/jelp") {
      bot.sendMessage(chatId, "salom sizga qanday yordam bera olaman");
    } else if (text.includes("instagram.com/")) {
      bot.sendMessage(chatId, "true");
    } else {
      bot.sendMessage(chatId, "⌛️");
      const apitext = `https://api.mymemory.translated.net/get?q=${text}&langpair=uz|en`;
      fetch(apitext).then(res => res.json()).then(data => {
        const tarjima = data.responseData.translatedText;
        const apiKey = "08lMDMJTQ135j0cASIRPtupwltWg5ZjCmMtsBQjnRk71JHA588uP5qsV";
        const apiURL = `https://api.pexels.com/v1/search?query=${tarjima}&page=1&per_page=4`;
        fetch(apiURL, {
          headers: { Authorization: apiKey }
        }).then(res => res.json()).then(data => {
          const media = [];
          //console.log(data.photos);
          data.photos.forEach(item => {
            media.push({ type: "photo", media: item.url });
          });

          bot.sendMediaGroup(chatId, media, { caption:'html' , parse_mode:'html' });
        }).catch((err) => { console.log(err) });
      });



      /**/
      setTimeout(() => {
        bot.deleteMessage(chatId, msg.message_id + 1);
      }, 5000);

    }
  });
}

botstart();


app.listen(3000, () => {
  console.log("server ishlamoqda...")
});
