import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { CategoryChannel } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('add-auto-voice')
    .setDescription('Adicionar um canal automático de voz no servidor.')
    .addStringOption(opt =>
      opt.setName('name').setRequired(true).setDescription('Nome dos canais.'),
    )
    .addChannelOption(opt =>
      opt
        .setName('categoria')
        .setDescription('Escolher a categoria para o bot monitorar e criar os canais ve voz.')
        .setRequired(true)
        .addChannelTypes([4]),
    )
    .addIntegerOption(opt =>
      opt
        .setName('user_limit')
        .setDescription('Número máximo de usuários nos canais de voz.')
        .setRequired(false),
    ),
  async execute(clientBot, interaction) {
    const { id, name } = interaction.options.getChannel('categoria') || {
      id: null,
      name: null,
    };
    const guild = clientBot.dbGuilds.get(interaction.guild?.id || '');
    const channelName = interaction.options.getString('name');
    const userLimit = interaction.options.getInteger('user_limit') || 0;
    const channelCategory = (await clientBot.channels.cache.get(id || '')) as CategoryChannel;

    if (
      id === null ||
      guild?.listAutoVoiceChannels === null ||
      channelCategory === undefined ||
      guild === undefined ||
      channelName === null ||
      name === null
    ) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Add Auto Voice Channel',
            description: 'Ocorreu um erro desconhecido.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    if (guild.listAutoVoiceChannels.filter(c => c.id === id).length > 0) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Add Auto Voice Channel',
            description: `A categoria \`${name}\` já está na lista de canais automáticos.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    if (channelCategory.children.filter(x => x.type === 'GUILD_VOICE').size > 0) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Add Auto Voice Channel',
            description: `A categoria \`${name}\` não deve possuir canais de voz.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    if (guild.listAutoVoiceChannels.length >= 10) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Add Auto Voice Channel',
            description: 'Você atingiu o limite de canais automáticos. (10 canais)',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    guild.addAutoVoiceChannel({
      id,
      name: channelName,
      userLimit,
    });

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'Add Auto Voice Channel',
          description: `A categoria \`${name}\` foi adicionada na lista de canais automáticos.`,
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });

    return true;
  },
} as Command;
