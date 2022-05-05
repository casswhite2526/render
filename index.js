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
      .then(res => {
        message.reply(`サーバーを起動しました。IPは${res.data}です。`)
      })
      .catch(err => {
        message.reply('既に起動しています。'+err.response.status)
	  //message.reply(string(${responce.status}))
      })
  }

  // 停止
if (message.content === '!mcstop') {
  axios.get(`${baseUrl}ec2-down`)
    .then(res => {
      message.reply('サーバーを停止しました。'+res.status)
  })
  .catch(err　=> {
    message.reply('既に停止しています。'+err.response.status)
  })
}

})

client.login(process.env.DISCORD_TOKEN)
