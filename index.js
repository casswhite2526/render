import { Client, Intents } from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

import axios from 'axios'
const baseUrl = process.env.LAMBDA_INVOKE_PATH

import { MessageActionRow, MessageButton } from 'discord.js'

client.once("ready", async () => {
  console.log("Ready!");
})

const startbtn = new MessageButton()
  .setCustomId("start")
  .setStyle("PRIMARY")
  .setLabel("START")

const stoptbtn = new MessageButton()
.setCustomId("stop")
.setStyle("PRIMARY")
.setLabel("STOP")

const IPbtn = new MessageButton()
.setCustomId("ip")
.setStyle("PRIMARY")
.setLabel("IP")

client.on('messageCreate', message => {
  if (message.content === '!mc') {
    axios.get(`${baseUrl}ec2-status`)
    .then(res => {
      if (res === 201){
      message.reply({
        content: res.data, components: [
          new MessageActionRow().addComponents(startbtn)
        ]
      })
    }

      if (res === 203){
        message.reply({
          content: res.data, components: [
            new MessageActionRow().addComponents(stopbtn), 
            new MessageActionRow().addComponents(IPbtn),
          ]
        })
    }
  })
  
  .catch(err　=> {
    message.reply('error'+err.response.data)
  })
  }


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
if (message.content === '!mcstatus') {
	axios.get(`${baseUrl}ec2-status`)
    .then(res => {
      message.reply(res.data)
	  
  })
  .catch(err　=> {
    message.reply('error'+err.response.data)
  })
}

if (message.content === '!mcip') {
	axios.get(`${baseUrl}ec2-ip`)
    .then(res => {
      message.reply(res.data)
	  
  })
  .catch(err　=> {
    message.reply('サーバーは起動していません。')
  })
}

});

client.login(process.env.DISCORD_TOKEN)
