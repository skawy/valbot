const { MongoClient } = require('mongodb')
const { DATABASE_INIT_FAILED } = require('../config/events.json')

const { Controller } = require('../structures')
const { log } = require('../utils/utils')

/**
 * @global
 */
class MongoController extends Controller {
	constructor (client){
		super(client, {
			name: 'MongoController'
		})
		this.ready = false

		this.mongo = new MongoClient(
			process.env.DB_HOST,
			{ useNewUrlParser: true }
		)

		this.init()
	}

	async init (){
		try{
			await this.mongo.connect()
			this.db = this.mongo.db(process.env.DB_NAME)

			if(typeof this.db !== 'undefined'){
				const message = 'Mongo controller ready!'
				this.ready = true

				log(this.client, message, 'info')
			}
		}
		catch(err){
			const message = `Something went wrong when initialising Mongo, ${err.message}, <@238009405176676352>`

			log(this.client, message, 'error')
		}
	}

	async syncLevels (id, { exp, text, voice }){
		if(this.ready){
			await this.db
				.collection('levels')
				.updateOne(
					{ id },
					{
						$set: { exp, text, voice }
					}, {
						upsert: true
					})
		}
		else QueueController.enqueue(this.syncLevels, id, { exp, text, voice })
	}

	async getLevel (id){
		if(this.ready){
			return this.db
				.collection('levels')
				.findOne({ id })
		}
	}

	async getResponses (){
		if(this.ready){
			return this.db.collection('responses').find({})
		}
	}

	/**
	 * Stores new responses, teaches bot
	 * @param {*} param0 reponse
	 */
	async saveResponse ({ invoker, reply }){
		if(this.ready){
			return this.db.collection('responses').updateOne({
				invoker
			}, {
				$set: {
					invoker,
					reply
				}
			}, {
				upsert: true
			})
		}
		else QueueController.enqueue(this.saveResponse, { invoker, reply } )
	}
}

module.exports = MongoController