import { Client, Intents } from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

import axios from 'axios'
const baseUrl = process.env.LAMBDA_INVOKE_PATH

client.once("ready", async () => {
  console.log("Ready!");
})

client.on('messageCreate', message => {
  // 起動
  if (message.content === '!mcstart') {
    axios.get(`${baseUrl}ec2-up`)
      .then((response) => {
        message.reply(`マイクラサーバを起動しました。IPは${response.data}です。`)
      })
      .catch((err) => {
        message.reply('${response.message}')
      })
  }

  // 停止
if (message.content === '!mcstop') {
  axios.get(`${baseUrl}ec2-down`)
    .then((response) => {
      message.reply('${response.message}')
  })
  .catch((err) => {
    message.reply('${response.message}')
  })
}

})

client.login(process.env.DISCORD_TOKEN)
