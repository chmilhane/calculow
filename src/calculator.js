const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

const { Evaluate, ClampString } = require('./util');

function CalculatorComponent() {
	const Grid = [];
	const Buttons = [
		['sin', 'cos', 'tan', 'CE', 'AC'],
		['7', '8', '9', '(', ')'],
		['4', '5', '6', '×', '÷'],
		['1', '2', '3', '+', '-'],
		['0', '.', 'π', '^', '=']
	];

	Buttons.forEach((row) => {
		const Row = new MessageActionRow();
	
		row.forEach((button) => {
			let style;
			switch (button) {
				case 'CE':
				case 'AC':
					style = 'red';
					break;

				case '(':
				case ')':
				case '^':
				case '÷':
				case '×':
				case '-':
				case '+':
				case 'sin':
				case 'cos':
				case 'tan':
					style = 'blurple';
					break;

				case '=':
					style = 'green';
					break;

				default:
					style = 'grey';
					break;
			}

			const ButtonComponent = new MessageButton()
				.setStyle(style)
				.setLabel(button)
				.setID(`calculow.calculator.${button}`);

			Row.addComponent(ButtonComponent);
		});

		Grid.push(Row);
	});

	return Grid;
}

module.exports = async(message, client) => {
	let currentResult = '0';

	const Embed = new MessageEmbed()
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(`\`\`\`${currentResult}\`\`\``)
		.setTimestamp()
		.setColor(0xFFCD4D);

	const EmbedMessage = await message.channel.send({
		embed: Embed,
		components:	CalculatorComponent()
	});

	function AddInput(input) {
		if (currentResult != '0' && !currentResult.startsWith('ERROR')) {
			currentResult += input;
		} else {
			currentResult = input;
		}
	}

	client.on('clickButton', async(button) => {;
		if (button.clicker && button.clicker.id !== message.author.id) {
			const Embed = new MessageEmbed()
				.setDescription(`You cannot use this calculator, it belongs to <@${message.author.id}>.`)
				.setTimestamp()
				.setColor('#ed2939');

			await button.reply.send(Embed, true);

			return;
		}

		const key = button.id.replace('calculow.calculator.', '').toString();
		switch (key) {
			case 'sin':
			case 'cos':
			case 'tan':
				AddInput(key + '(');
				break;

			case 'CE':
				currentResult = currentResult.substring(0, currentResult.length - 1) || '0';
				break;

			case 'AC':
				currentResult = '0';
				break;

			case '=':
				if (currentResult != '0' && !currentResult.startsWith('ERROR')) {
					currentResult = Evaluate(currentResult, message);
				}

				break;

			default:
				AddInput(key);
				break;
		}

		if (currentResult !== '0' && !currentResult.startsWith('ERROR')) {
			Embed.setColor('#00a86b');
		} else if (currentResult === '0' && !currentResult.startsWith('ERROR')) {
			Embed.setColor('#ffcc4d');
		} else {
			Embed.setColor('#ed2939');
		}

		EmbedMessage.edit(Embed.setDescription(`\`\`\`${ClampString(currentResult)}\`\`\``));

		await button.reply.defer();
	});
}