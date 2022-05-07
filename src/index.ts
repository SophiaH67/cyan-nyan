import { Client, Intents, Message, TextChannel } from "discord.js";
import express from "express";
const app = express();

//@ts-expect-error
app.use(function (req, res, next) {
  var data = "";
  req.on("data", function (chunk) {
    data += chunk;
  });
  req.on("end", function () {
    //@ts-expect-error
    req.rawBody = data;
    next();
  });
});

interface MyBot extends Client {
  messageMap: { [key: string]: Message[] };
}

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}) as MyBot;
bot.messageMap = {};

bot.on("ready", () => {
  console.log("Ready!");
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Listening on port 0.0.0.0:${port}`);
  });
});

bot.on("message", (message) => {
  if (!message.reference?.messageId) return;
  if (!bot.messageMap[message.reference.messageId]) return;
  bot.messageMap[message.reference.messageId].push(message);
});

app.get("/:messageId", (req, res) => {
  const messageId = req.params.messageId;
  if (!bot.messageMap[messageId]) {
    res.status(404).send("Not found");
    return;
  }
  res.send(bot.messageMap[messageId]);
});

app.post("/", async (req, res) => {
  //@ts-expect-error
  const message = req.rawBody as string;

  const channelId = process.env.CHANNEL_ID || "972595006579826740";
  const channel = bot.channels.cache.get(channelId) as TextChannel;
  const messageObject = await channel.send(message);
  bot.messageMap[messageObject.id] = [messageObject];
  res.send(messageObject);
});

bot.login(process.env.TOKEN);
