import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { GuildMember } from 'discord.js';
import { NekosLife } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder()
    .setName('beijo')
    .setDescription('Beijar uma pessoa.')
    .addUserOption(x =>
      x.setName('user').setDescription('Usuário que você quer beijar.').setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const user = interaction.options.getMember('user') as GuildMember;
    const img = await NekosLife('kiss');

    if (user.id === interaction.user.id) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            description: 'Você não pode beijar você mesmo.',
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          description: `<@${user.user.id}> tomou um beijo do(a) <@${interaction.user.id}>!`,
          image: {
            url: img,
          },
        },
      ],
    });
    return true;
  },
} as Command;
