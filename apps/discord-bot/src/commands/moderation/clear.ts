import { SlashCommandBuilder } from '@discordjs/builders';
import { TextChannel } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';
import Logger from '@common/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Apagar mensagens de um chat.')
    .addIntegerOption(opt =>
      opt
        .setName('amount')
        .setMaxValue(100)
        .setMinValue(1)
        .setDescription('Total de mensagens que deseja apagar.')
        .setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const amount = interaction.options.getInteger('amount');
    try {
      await (interaction.channel as TextChannel)?.bulkDelete(amount || 0);
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Clear',
            description: `${amount} mensagens foram apagadas.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    } catch (err) {
      Logger.error(err);
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Clear',
            description: 'Não foi possível apagar as mensagens.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
    return true;
  },
} as Command;
