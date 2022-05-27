import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';
import Logger from '@common/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('changenick')
    .setDescription('Definir um intervalo de mensagens no canal de texto atual.')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Usuário que você quer alterar o nickname')
        .setRequired(true),
    )
    .addStringOption(opt =>
      opt.setName('nick').setDescription('Nickname do usuário').setRequired(false),
    ),
  async execute(clientBot, interaction) {
    const user = interaction.options.getMember('user') as GuildMember;
    const nick = interaction.options.getString('nick');
    try {
      await user.setNickname(nick);
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Changenick',
            description: `Nickname do usuário ${user.displayName} alterado para ${
              nick === null ? user.displayName : nick
            }.`,
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
            title: 'Changenick',
            description: `O bot não tem permissão para alterar o nickname do usuário ${user.displayName}.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
    return true;
  },
} as Command;
