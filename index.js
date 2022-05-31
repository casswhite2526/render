import { Client, Intents } from 'discord.js'
import { MessageActionRow, MessageButton } from 'discord.js'
import axios from 'axios'

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

let resdata = ""

client.on('interactionCreate', async interaction => {
  //「起動」が押された時
  if (interaction.customId === 'start') {
    interaction.deferReply()
    await axios.get(`${baseUrl}ec2-up`)
    .then(res =>{
      resdata = res.data
    })
    .catch(err =>{
      resdata = err.response.data
    })
    interaction.editReply({
      content: resdata,
      components: [
        new MessageActionRow().addComponents(stopbtn)
      ]
    })
    client.user.setPresence({
      activities: [{
        name: "Minecraft Server",
        status: "online",
        url: resdata,
      }]
    })
  }
  

  //「停止」が押された時
  if (interaction.customId === 'stop') {
    interaction.deferReply()
    await axios.get(`${baseUrl}ec2-down`)
    .then(res =>{
      resdata = res.data
    })
    .catch(err =>{
      resdata = err.response.data
    })
    interaction.editReply({
      content: resdata, 
      components: [
        new MessageActionRow().addComponents(startbtn)
      ]
    })
    client.user.setPresence({
      activities: [{
        name: "",
        status: "idle"
      }]
    })
  }

  //「IP」が押された時
  if (interaction.customId === 'ip') {
    interaction.deferReply()
    await axios.get(`${baseUrl}ec2-ip`)
    .then(res =>{
      resdata = res.data
    })
    .catch(err =>{
      resdata = err.response.data
    })
    interaction.editReply(resdata)
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
            new MessageActionRow().addComponents(startbtn)
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
