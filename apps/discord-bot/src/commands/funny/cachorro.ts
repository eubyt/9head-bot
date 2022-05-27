import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { NekosLife } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder()
    .setName('cachorro')
    .setDescription('Enviar uma imagem de um cachorro.'),
  async execute(clientBot, interaction) {
    const img = await NekosLife('hug');

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          description: `<@${interaction.user.id}> mandou um :dog:`,
          image: {
            url: img,
          },
        },
      ],
    });
    return true;
  },
} as Command;
