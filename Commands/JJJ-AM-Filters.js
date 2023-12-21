import { SlashCommandBuilder } from "discord.js";
import getPrice from "../bot.js";

export default {
    data: new SlashCommandBuilder()
        .setName('jjjam')
        .setDescription('JJJ AM Filters'),
    async execute(interaction) {
        let response = "";
        try {
            const { perChange } = await getPrice();
            response += "Percent change since last close: " + perChange + "%";
            if (perChange < 0.75) {
                response += "\nPlace 0DTE AM Calls";
                response += "\nPlace 0DTE AM Puts";
            } else if (perChange < 2.0) {
                response += "\nDon't Place 0DTE AM Calls";
                response += "\nPlace 0DTE AM Puts";
            } else {
                response += "\nDon't Place 0DTE AM Calls";
                response += "\nDon't Place 0DTE AM Puts";
            }
            await interaction.reply(response);
        } catch (err) {
            console.error(err);
        }
    },
};