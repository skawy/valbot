const { Command } = require("../structures")
const { CommandOptions } = require("../structures")
const { log } = require("../utils/utils")

class Teach extends Command {
	/**
	 * Constructs help command
	 * @param {ValClient} client
	 */
  constructor(client) {
		const options = new CommandOptions({
			name: `teach`,
			cooldown: 1000,
			nOfParams: 1,
			requiredAuthLevel: 2,
			description: `بتمسح رسايل بعدد n`,
			exampleUsage: `${client.prefix} teach hello`,
			extraParams: false
		})

		super(client, options)
  }

  async _run(context) {
		const { message, channel, params, member } = context
		const invoker = params.join(' ').replace(/"/g, '')

		const collectorOptions = { max: 1, time: 60000, errors: ['time'] }
		const collectorFilter = m => m.author.id === member.id

		if(invoker.length > 1){
			message.reply('المفروض ارد ازاي بقى؟')

			channel.awaitMessages(collectorFilter, collectorOptions)
			.then(messages => {

				ConversationController.teach({
					invoker,
					reply: messages.first().content
				})
				.then(res => {
					message.reply(`تمام, هبقى ارد على "${invoker}" بـ "${messages.first().content}"`)
				})
				.catch(err => {
					log(this.client, err.message, 'info')
				})

			})
			.catch(err => {
				console.log(err)
				message.reply('وقتك خلص, حاول تاني', err.message)
			})
		}
		else message.reply(`لازم يكون الرسالة الاولية طويلة كفاية`)
	}

}

module.exports = Teach