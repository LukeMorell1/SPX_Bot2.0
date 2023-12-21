import { REST, Routes } from "discord.js";
import fs from 'node:fs';
import path from 'node:path';

const data = fs.readFileSync("./auth.json");
const jsondata = JSON.parse(data);
const clientId = jsondata.clientId
const token = jsondata.token;
const guilds = jsondata.guilds;

const commands = [];
// Grab all the command files from the commands directory that end in .js
const commandsPath = path.join(process.cwd(), "./Commands");
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const module = await import(filePath);
    const command = module.default;
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

//Deploys the commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		for (const scheduledGuild of guilds) {
			console.log(scheduledGuild);
			const data = await rest.put(
				Routes.applicationCommands(clientId, scheduledGuild.id),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands for guild: ${scheduledGuild.id}.`);
		}
	} catch (error) {
		console.error(error);
	}
})();