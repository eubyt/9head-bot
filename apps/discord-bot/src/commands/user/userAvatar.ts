import Config from '@common/config';
import EmbedTemplate from '@common/embedTemplate';
import Command from '@commands/command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AllowedImageSize, MessageActionRow, MessageButton } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('user-avatar')
    .addUserOption(opt =>
      opt
        .setName('user-target')
        .setDescription('Escolha o usuário para capturar o avatar.')
        .setRequired(true),
    )
    .addStringOption(opt =>
      opt
        .setName('user-avatar-size')
        .setRequired(false)
        .setDescription('Escolha o tamanho do avatar. (Opcional)')
        .addChoice('16px', '16')
        .addChoice('32px', '32')
        .addChoice('56px', '56')
        .addChoice('64px', '64')
        .addChoice('128px', '128')
        .addChoice('256px', '256')
        .addChoice('300px', '300')
        .addChoice('512px', '512')
        .addChoice('1024px', '1024')
        .addChoice('2048px', '2048')
        .addChoice('4096px', '4096'),
    )
    .setDescription('Pegar a imagem de avatar de um usuário.'),
  async execute(clientBot, interaction) {
    const user = interaction.options.getUser('user-target');
    const avatarSize = interaction.options.getString('user-avatar-size') || '1024';

    if (!user) {
      await interaction.reply(EmbedTemplate.error('Usuário não encontrado.'));
      return false;
    }

    if (user.avatarURL({ size: parseInt(avatarSize, 10) as AllowedImageSize }) === null) {
      await interaction.reply(EmbedTemplate.error('Usuário não possui avatar.'));
      return false;
    }

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: `Avatar de ${user.username}`,
          image: {
            url: user.avatarURL({
              dynamic: true,
              format: 'png',
              size: 1024,
            }) as string,
          },
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel(`Abrir em nova janela (${avatarSize}px)`)
            .setStyle('LINK')
            .setURL(
              user.avatarURL({
                dynamic: true,
                format: 'png',
                size: parseInt(avatarSize, 10) as AllowedImageSize,
              }) as string,
            ),
        ),
      ],
    });
    return true;
  },
} as Command;
