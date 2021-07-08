const { APIMessage } = require('discord.js');

function GetApp(guildId, client) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}

	return app;
}

async function Reply(interaction, response, client) {
	let data = {
		content: response
	}

	if (typeof response === 'object') {
		data = await CreateAPIMessage(interaction, response, client);
	}

	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data
		}
	});
}

async function CreateAPIMessage(interaction, content, client) {
	const { data, files } = await APIMessage.create(
		client.channels.resolve(interaction.channel_id),
		content
	)
		.resolveData()
		.resolveFiles();

	return { ...data, files }
}

module.exports = {
  GetApp,
  Reply,
  CreateAPIMessage
}