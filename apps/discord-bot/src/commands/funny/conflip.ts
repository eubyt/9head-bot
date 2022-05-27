import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';

export default {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Jogar cara ou coroa.'),
  async execute(clientBot, interaction) {
    const result = Math.random() < 0.5 ? 'cara' : 'coroa';
    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'Cara ou coroa?',
          description: `A moeda caiu em **${result.toUpperCase()}**!`,
        },
      ],
    });
    return true;
  },
} as Command;
