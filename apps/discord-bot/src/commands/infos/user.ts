import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';
import Logger from '@common/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Visualizando informações do usuário do Discord.')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Usuário que você quer ver informações.')
        .setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const { user, roles, joinedAt } = interaction.options.getMember('user') as GuildMember;

    try {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: `Informações do usuário ${user}#${user.discriminator}`,
            fields: [
              {
                name: 'ID',
                value: user.id,
                inline: true,
              },
              {
                name: 'Nickname',
                value: user.username === null ? 'Nenhum' : user.username,
                inline: true,
              },
              {
                name: 'Discriminator',
                value: user.discriminator,
                inline: true,
              },
              {
                name: 'Cargos',
                value: roles.cache.map(role => role.name).join('\n'),
                inline: true,
              },
              {
                name: 'Criado em',
                value: user.createdAt.toLocaleString(),
                inline: true,
              },
              {
                name: 'Entrou no servidor em',
                value: joinedAt === null ? 'Não entrou no servidor.' : joinedAt.toLocaleString(),
                inline: true,
              },
            ],
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
            title: 'User Info',
            description: `O bot não consegue ver as informações do usuário ${user.username}.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }

    return true;
  },
} as Command;
