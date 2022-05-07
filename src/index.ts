import { Client, Intents, Message } from "discord.js";

interface MyBot extends Client {
  messageMap: { [key: string]: Message[] };
}

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}) as MyBot;
bot.messageMap = {};

bot.on("ready", () => {
  console.log("Ready!");
});

bot.on("message", (message) => {
  if (!message.reference?.messageId) return;
  if (!bot.messageMap[message.reference.messageId]) return;
  bot.messageMap[message.reference.messageId].push(message);
});

bot.login(process.env.TOKEN);
