const { evaluate } = require('mathjs');
const chalk = require('chalk');

module.exports = {
	Evaluate: (expr, message) => {
		try {
			expr = expr
				.replace(/×/g, '*')
				.replace(/÷/g, '/')
				.replace(/π/g, 'pi');
	
			const dm = message.channel.type === 'dm';
	
			const result = evaluate(expr).toString();
	
			if (result === 'Infinity') {
				throw new Error(result);
			}
	
			if (message) {
				console.log(chalk`{yellow [${dm ? 'Direct Messages' : message.channel.guild.name}}${dm ? '': chalk` in {yellow #${message.channel.name}}`}{yellow ]} {green (${message.author.username}#${message.author.discriminator})}: Evaluated {green ${expr}} = {green ${result}}`);
			}
	
			return result;
		} catch(e) {
			return `ERROR: ${e.message}`;
		}
	},
	ClampString: (string, length = 512) => {
		if (string.length > length) {
			return string.substring(0, length - 3) + '...';
		}
	
		return string;
	}
}