import { SlashCommandBuilder } from "discord.js";
import getPrice from "../bot.js";

export default {
  data: new SlashCommandBuilder()
    .setName("jjjpm")
    .setDescription("JJJ PM Filters"),
  async execute(interaction) {
    let response = "";
    try {
      const { perChange, marketStatus } = await getPrice();
      response += "PM COMMANDS: \n";
      if (marketStatus === "Closed") {
        response += "Market is Closed Today :(";
      } else {
        response += "Percent change since last close: " + perChange + "%";
        if (perChange < 1.25 && perChange > -1.25) {
          response += "\nPlace 1DTE Puts";
          response += "\nPlace CDS";
        } else if (perChange < 1.25) {
          response += "\nPlace 1DTE Puts";
          response += "\nDon't Place CDS";
        } else {
          response += "\nDon't Place 1DTE Puts";
          response += "\nDon't Place CDS";
        }
      }
      await interaction.reply(response);
    } catch (err) {
      console.error(err);
    }
  },
};
