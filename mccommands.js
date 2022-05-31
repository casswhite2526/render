
//ボタン表示
export default function mccommand () {
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
}

// 起動
export default function startcommand () {
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
}

// 停止
export default function stopcommand () {
    if (message.content === '!mcstop') {
        axios.get(`${baseUrl}ec2-down`)
        .then(res => {
            message.reply('サーバーを停止しました。')
        })
        .catch(err　=> {
            message.reply('既に停止しています。')
        })
    } 
}

// ステータス表示
export default function statuscommand () {
    if (message.content === '!mcstatus') {
        axios.get(`${baseUrl}ec2-status`)
        .then(res => {
            message.reply(res.data)
        })
        .catch(err　=> {
            message.reply('error'+err.response.data)
        })
    }
}

// IP表示
export default function ipcommand () {
    if (message.content === '!mcip') {
        axios.get(`${baseUrl}ec2-ip`)
        .then(res => {
        message.reply(res.data)
        })
        .catch(err　=> {
        message.reply('サーバーは起動していません。')
        })
    }
}

