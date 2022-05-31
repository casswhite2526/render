import { Client, Intents } from 'discord.js'
import { MessageActionRow, MessageButton } from 'discord.js'
import axios from 'axios'
import * as Clipboard from "clipboard"

const baseUrl = process.env.LAMBDA_INVOKE_PATH
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const startbtn = new MessageButton()
  .setCustomId("start")
  .setStyle("PRIMARY")
  .setLabel("起動")

const stopbtn = new MessageButton()
.setCustomId("stop")
.setStyle("PRIMARY")
.setLabel("停止")

const IPbtn = new MessageButton()
.setCustomId("ip")
.setStyle("PRIMARY")
.setLabel("IP")

client.once("ready", async () => {
  console.log("Ready!");
})

client.on('interactionCreate', async interaction => {
  //「起動」が押された時
  if (interaction.customId === 'start') {
    interaction.deferReply()
    axios.get(`${baseUrl}ec2-up`)
    interaction.editReply(
      interaction.reply({
        content: res.data,
        content: "start", 
        components: [
          new MessageActionRow().addComponents(stopbtn,IPbtn)
        ]
      })
    ) 
  }
  

  //「停止」が押された時
  if (interaction.customId === 'stop') {
    axios.get(`${baseUrl}ec2-down`)
    interaction.reply({
      content: res.data, 
      content: "stop",
      components: [
        new MessageActionRow().addComponents(startbtn)
      ]
    })
  }

  //「IP」が押された時
  if (interaction.customId === 'ip') {
    axios.get(`${baseUrl}ec2-ip`)
    Clipboard.copy("a")
  }
})


client.on('messageCreate', message => {
  //ボタン表示
  if (message.content === '!mc') {
    axios.get(`${baseUrl}ec2-status`)
    .then(res => {
      if (res.data === 'サーバー停止済み'){
        message.reply({
          content: res.data, components: [
            new MessageActionRow().addComponents(startbtn, stopbtn, IPbtn)
          ]
        })
      } 
      else if (res.data === 'サーバーは稼働中'){
        message.reply({
          content: res.data, components: [
            new MessageActionRow().addComponents(stopbtn, IPbtn)
          ]
        })
      }
      else {
        message.reply(
          "The server is in procces. Plese try again later."
        )
      }
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

  // ステータス表示
  if (message.content === '!mcstatus') {
    axios.get(`${baseUrl}ec2-status`)
    .then(res => {
      message.reply(res.data)
    })
    .catch(err　=> {
      message.reply('error'+err.response.data)
    })
  }

  // IP表示
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
