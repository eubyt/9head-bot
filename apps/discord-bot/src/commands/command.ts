import { SlashCommandBuilder } from '@discordjs/builders';
import ClientBot from 'client';
import { CommandInteraction } from 'discord.js';

interface Command {
  data: SlashCommandBuilder;
  execute(clientBot: ClientBot, interaction: CommandInteraction): Promise<boolean>;
}

export default Command;
