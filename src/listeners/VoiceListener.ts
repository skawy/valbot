import Listener from '../structures/Listener';
import ValClient from '../ValClient';
import { VoiceState } from 'discord.js';
import { LevelsController } from '../Controllers';

export default class VoiceListener extends Listener {
	constructor(client: ValClient) {
		super(client);

		this.events.set('voiceStateUpdate', this.onVoiceStateUpdate);
	}

	onVoiceStateUpdate = (_: VoiceState, newState: VoiceState): void => {
		const { member, id } = newState;

		if (member.user.bot) return;

		const levels = <LevelsController>this.client.controllers.get('levels');

		if (this.shouldTrack(newState)) levels.trackUser(id);
		else levels.untrackUser(id);
	};

	shouldTrack = (state: VoiceState): boolean => {
		const { deaf, mute, channel } = state;

		return !deaf && !mute && channel && channel.id !== '571721579214667786';
	};
}
