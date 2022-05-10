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
        message.reply(`サーバーを起動しました。`)
		message.reply(res.data)
      })
      .catch(err => {
		if (err.response.status == 400) {
		message.reply('既に起動しています。')
		message.reply(err.response.data)
		}
		else {
		console.log(err.response.data)
		message.reply('error'+err.response.data)
		}
      })
  }

  // 停止
if (message.content === '!mcstop') {
	axios.get(`${baseUrl}ec2-down`)
    .then(res => {
      message.reply('サーバーを停止しました。')
	  
  })
  .catch(err　=> {
    message.reply('既に停止しています。')
  })
}
if (message.content === '!mcsts') {
	axios.get(`${baseUrl}ec2-status`)
    .then(res => {
      message.reply(res.data)
	  
  })
  .catch(err　=> {
    message.reply('error'+err.response.data)
  })
}
})

client.login(process.env.DISCORD_TOKEN)
