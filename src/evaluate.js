const { evaluate } = require('mathjs');
// const chalk = require('chalk');

module.exports = (expr) => {
	try {
		expr = expr
			.replace(/×/g, '*')
			.replace(/÷/g, '/')
			.replace(/π/g, 'pi');

			// const dm = message.channel.type === 'dm';
			
			// if (message) {
				// 	console.log(chalk`{yellow [${dm ? 'Direct Messages' : message.channel.guild.name}}${dm ? '': chalk` in {yellow #${message.channel.name}}`}{yellow ]} {green (${message.author.username}#${message.author.discriminator})}: Evaluated {green ${expr}} = {green ${result}}`);
				// }
		const result = evaluate(expr).toString();
		return result;
	} catch(e) {
		return `ERROR: ${e.message}`;
	}
}