require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js');
const { DISCORD_TOKEN: Token, DISCORD_PREFIX: Prefix } = process.env;

const client = new Client();
require('discord-buttons')(client);

const Calculator = require('./src/calculator');
const Evaluate = require('./src/evaluate');

const { red } = require('chalk');

function HelpMessage(message) {
	const embed = new MessageEmbed()
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(`To use a command with <@${client.user.id}>, use \`${Prefix}command\`.\nFor example, \`${Prefix}help\`.\n`)
		.addFields([
			{ name: `\\📜 ${Prefix}help`, value: 'Shows this message.' },
			{ name: `\\✨ ${Prefix}eval`, value: `Perform complex operations, without the calculator constraints imposed by Discord.` },
			{ name: `\\📟 ${Prefix}calculator`, value: `A calculator using Discord buttons.` },
		])
		.setTimestamp()
		.setColor(0x2F3136);

	message.channel.send(embed);
}

client.on('message', (message) => {
	try {
		if (message.author.bot) return;
		// if (message.type === 'dm') return;

		if (message.content.startsWith(Prefix + 'help') || message.mentions.has(client.user)) {
			HelpMessage(message);
			return;
		}

		if (message.content.startsWith(Prefix + 'calculator')) {
			Calculator(message, client);
			return;
		}

		if (message.content.startsWith(Prefix + 'eval')) {
			const expr = message.content.substring(Prefix.length + 5, message.content.length);
			const result = Evaluate(expr, message);

			let color = '#00a86b';
			if (result.startsWith('ERROR')) {
				color = '#ed2939';
			}

			const embed = new MessageEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.addFields([
					{ name: '\\▶️ Input', value: `\`\`\`${expr}\`\`\`` },
					{ name: '\\◀️ Output', value: `\`\`\`${result}\`\`\`` },
				])
				.setTimestamp()
				.setColor(color);

			message.channel.send(embed);
			return;
		}

		// message.delete({ timeout: 3000 });
	}	catch({ message }) {
		console.error(red(`[Error]: ${message}`));
	}
});

client.login(Token);