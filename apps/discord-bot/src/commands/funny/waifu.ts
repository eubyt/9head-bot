import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { NekosLife } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder()
    .setName('waifu')
    .setDescription('Mostrar sua waifu para as pessoas.'),
  async execute(clientBot, interaction) {
    const img = await NekosLife('goose');

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          description: `<@${interaction.user.id}> está com sua waifu!`,
          image: {
            url: img,
          },
        },
      ],
    });
    return true;
  },
} as Command;
