import ValClient from '../ValClient';

import { Command, CommandContext } from '../structures';
import { log, notify } from '../utils/general';
import { getRoleObject } from '../utils/object';
import { LevelsController } from '../Controllers';

export default class MilestoneGet extends Command {
	constructor(client: ValClient) {
		super(client, {
			name: `milestoneget`,
			category: 'Management',
			cooldown: 1000,
			nOfParams: 1,
			description: `بتجيبلكوا الـ milestone اللي عايزنها في level معين. ممكن مديهاش level فا تجيبلكوا كل ال milestones`,
			exampleUsage: `<level>`,
			extraParams: false,
			optionalParams: 1,
			auth: {
				method: 'ROLE',
				required: 'AUTH_ADMIN'
			}
		});
	}

	_run = async (context: CommandContext) => {
		const { message, params } = context;

		const levelRegex = /^(\d+)$/i;

		try {
			if (params.length === 0) return message.reply(this.getAllMilestones());

			const levelMatch = params[0].match(levelRegex);
			if (!levelMatch)
				return message.reply('تاني باراميتير لازم يكون رقم الـ level');

			return message.reply(this.getLevelMilestones(Number(levelMatch[0])));
		} catch (err) {
			log(this.client, err, 'error');
		}
	};

	getLevelMilestones = (level: number) => {
		const levels = <LevelsController>this.client.controllers.get('level');
		const milestones = levels.getMilestone(level);

		if (!milestones) return 'مفيش milestones للـ level ده';
		else {
			let milestonesString = `Level #${level} Achievements\n${'-'.repeat(
				30
			)}\n`;

			milestones.forEach(({ name, description, roleID }) => {
				const role = getRoleObject(this.client, roleID);
				milestonesString += `Name: ${name}\nDescription: ${description}\nRole: ${role.name}\n\n`;
			});

			return milestonesString;
		}
	};

	getAllMilestones = () => {
		const levels = <LevelsController>this.client.controllers.get('level');
		let milestones = '\n';

		if (Object.keys(levels.milestones).length === 0)
			return 'مفيش milestones خالص';

		Object.keys(levels.milestones).forEach(level => {
			milestones += `Level #${level} Achievements\n${'-'.repeat(30)}\n`;

			levels.milestones
				.get(Number(level))
				.forEach(({ name, description, roleID }) => {
					const role = getRoleObject(this.client, roleID);
					milestones += `Name: ${name}\nDescription: ${description}\nRole: ${role.name}\n\n`;
				});
		});

		return milestones;
	};
}