import fs from "node:fs";
import path from "node:path";
import { Client, Events, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import getPrice from "./bot.js";

const data = fs.readFileSync("./auth.json");
const jsondata = JSON.parse(data);
const token = jsondata.token;
const guilds = jsondata.guilds;

const authGuilds = guilds.map((guilds) => guilds.id); //Getting Guild IDs

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Map(); //key-value pair for command list
//Creates a path to the commands directory
const commandsPath = path.join(process.cwd(), "./Commands");
//Returns an array of all file names in the directory
const commandFiles = fs.readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const module = await import(filePath);
  const command = module.default;
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      "[WARNING] The command at " + filePath +
        ' is missing a required "data" or "execute" property.'
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (authGuilds.includes(interaction.guildId)) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.log("No command matching " + command + " was found");
      } else {
        try {
          await command.execute(interaction);
        } catch (err) {
          console.error(err);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          }
        }
      }
    } else {
      interaction.reply("The bot is not authorized for use in this guild");
    }
  }
});

cron.schedule("55 15 * * 1-5", async () => {
  const { status } = await getPrice();
  if (status == "Open") {
    for (const scheduleGuild of guilds) {
      const guild = client.guilds.cache.get(scheduleGuild.id);
      if (guild) {
        for (const scheduleChannel of scheduleGuild.channels) {
          const channel = guild.channels.cache.get(scheduleChannel);
          if (channel && channel.isTextBased()) {
            //simulate client calling the commands and triggering the "interaction"
            const interaction = {
              commandName: "jjjpm",
              channelId: scheduleChannel,
              client: {
                commands: client.commands,
              },
              reply: async (response) => {
                channel.send(response);
              },
            };
            // Execute the 'PM filters' command
            const filtersCommand = interaction.client.commands.get(
              interaction.commandName
            );
            if (filtersCommand) {
              try {
                await filtersCommand.execute(interaction);
              } catch (err) {
                console.error(err);
                channel.send({
                  content: "There was an error while executing this command!",
                  ephemeral: true,
                });
              }
            } else {
              channel.send({
                content: "jjjpm Command Not Found!",
                ephemeral: true,
              });
            }
          }
        }
      } else {
        console.log("Guild not approved!");
      }
    }
  }
});

cron.schedule("35 9 * * 1-5", async () => {
  const { status } = await getPrice();
  if (status == "Open") {
    for (const scheduleGuild of guilds) {
      const guild = client.guilds.cache.get(scheduleGuild.id);
      if (guild) {
        for (const scheduleChannel of scheduleGuild.channels) {
          const channel = guild.channels.cache.get(scheduleChannel);
          if (channel && channel.isTextBased()) {
            //simulate client calling the commands and triggering the "interaction"
            const interaction = {
              commandName: "jjjam",
              channelId: scheduleChannel,
              client: {
                commands: client.commands,
              },
              reply: async (response) => {
                channel.send(response);
              },
            };
            // Execute the 'AM filters' command
            const filtersCommand = interaction.client.commands.get(
              interaction.commandName
            );
            if (filtersCommand) {
              try {
                await filtersCommand.execute(interaction);
              } catch (err) {
                console.error(err);
                channel.send({
                  content: "There was an error while executing this command!",
                  ephemeral: true,
                });
              }
            } else {
              channel.send({
                content: "jjjam Command Not Found!",
                ephemeral: true,
              });
            }
          }
        }
      } else {
        console.log("Guild not approved!");
      }
    }
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
