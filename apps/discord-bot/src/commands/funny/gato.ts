import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { NekosLife } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder().setName('gato').setDescription('Enviar uma imagem de um gato.'),
  async execute(clientBot, interaction) {
    const img = await NekosLife('meow');

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          description: `<@${interaction.user.id}> mandou um :cat:`,
          image: {
            url: img,
          },
        },
      ],
    });
    return true;
  },
} as Command;
