import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { NekosLife } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder().setName('ganso').setDescription('Enviar uma imagem de ganso.'),
  async execute(clientBot, interaction) {
    const img = await NekosLife('goose');

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          description: `<@${interaction.user.id}> invocou o ganso!`,
          image: {
            url: img,
          },
        },
      ],
    });
    return true;
  },
} as Command;
