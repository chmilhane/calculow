require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js');

const { MessageComponentTypes } = require('discord-buttons/src/v12/Constants');
const MessageComponent = require('discord-buttons/src/v12/Classes/MessageComponent');

const client = new Client();
require('discord-buttons')(client);

const { GetApp, Reply } = require('./src/api/interactions');

const Calculator = require('./src/calculator');
const Evaluate = require('./src/evaluate');

const chalk = require('chalk');

function App() {
	const guildId = '747826281692921869';
	return GetApp(guildId, client);
}

client.on('ready', async() => {
	console.log(chalk`{green Logged in as ${client.user.tag}}`);

	// const commands = await App().commands.get();
	// console.log(commands);

	await App().commands.post({
		data: {
			name: 'calculator',
			description: 'A calculator using Discord buttons.'
		}
	});

	await App().commands.post({
		data: {
			name: 'eval',
			description: 'Perform complex operations, without the calculator constraints imposed by Discord.',
			options: [
				{
					name: 'expression',
					description: 'The expression to evaluate',
					required: true,
					type: 3
				}
			]
		}
	});

	client.ws.on('INTERACTION_CREATE', async(interaction) => {
		if (!interaction.data.component_type) {
			client.emit('slashCommand', interaction);
			return;
		}
	});
});

client.on('slashCommand', (interaction) => {
	try {
		const { name, options } = interaction.data;
		const command = name.toLowerCase();

		const args = {}
		if (options) {
			for (const { name, value } of options) {
				args[name] = value;
			}
		}

		switch (command) {
			case 'calculator':
				Calculator(interaction, client);
				break;

			case 'eval':
				if (!args.expression) return;

				const result = Evaluate(args.expression);

				let color = '#00a86b';
				if (result.startsWith('ERROR')) {
					color = '#ed2939';
				}

				const embed = new MessageEmbed()
				.setAuthor(`${interaction.member.user.username}#${interaction.member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`)
					.addFields([
						{ name: '\\▶️ Input', value: `\`\`\`${args.expression}\`\`\`` },
						{ name: '\\◀️ Output', value: `\`\`\`${result}\`\`\`` },
					])
					.setTimestamp()
					.setColor(color);

				Reply(interaction, embed, [], client);
		}
	}	catch({ message }) {
		console.error(chalk`{red [Error]: ${message}}`);
	}
});

// function HelpMessage(message) {
// 	const embed = new MessageEmbed()
// 		.setAuthor(message.author.tag, message.author.displayAvatarURL())
// 		.setDescription(`To use a command with <@${client.user.id}>, use \`${Prefix}command\`.\nFor example, \`${Prefix}help\`.\n`)
// 		.addFields([
// 			{ name: `\\📜 ${Prefix}help`, value: 'Shows this message.' },
// 			{ name: `\\✨ ${Prefix}eval`, value: `Perform complex operations, without the calculator constraints imposed by Discord.` },
// 			{ name: `\\📟 ${Prefix}calculator`, value: `A calculator using Discord buttons.` },
// 		])
// 		.setTimestamp()
// 		.setColor(0x2F3136);

// 	message.channel.send(embed);
// }

// client.on('message', (message) => {
// 	try {
// 		if (message.author.bot) return;
// 		// if (message.type === 'dm') return;

// 		if (message.content.startsWith(Prefix + 'help') || message.mentions.has(client.user)) {
// 			HelpMessage(message);
// 			return;
// 		}

// 		if (message.content.startsWith(Prefix + 'calculator')) {
// 			Calculator(message, client);
// 			return;
// 		}

// 		if (message.content.startsWith(Prefix + 'eval')) {
			// const expr = message.content.substring(Prefix.length + 5, message.content.length);
			// const result = Evaluate(expr, message);

			// let color = '#00a86b';
			// if (result.startsWith('ERROR')) {
			// 	color = '#ed2939';
			// }

			// const embed = new MessageEmbed()
			// 	.setAuthor(message.author.tag, message.author.displayAvatarURL())
			// 	.addFields([
			// 		{ name: '\\▶️ Input', value: `\`\`\`${expr}\`\`\`` },
			// 		{ name: '\\◀️ Output', value: `\`\`\`${result}\`\`\`` },
			// 	])
			// 	.setTimestamp()
			// 	.setColor(color);

// 			message.channel.send(embed);
// 			return;
// 		}

// 		// message.delete({ timeout: 3000 });
	// }	catch({ message }) {
	// 	console.error(red(`[Error]: ${message}`));
	// }
// });

client.login(process.env.DISCORD_TOKEN);