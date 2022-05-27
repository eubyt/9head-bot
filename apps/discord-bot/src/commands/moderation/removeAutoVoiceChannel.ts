import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';
import { CategoryChannel } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove-auto-voice')
    .setDescription('Remover um canal automático de voz no servidor.')
    .addChannelOption(opt =>
      opt
        .setName('categoria')
        .setDescription(
          'Escolher a categoria que está sendo monitorada para criar os canais automático.',
        )
        .setRequired(true)
        .addChannelTypes([4]),
    ),
  async execute(clientBot, interaction) {
    const { id, name } = interaction.options.getChannel('categoria') || {
      id: null,
      name: null,
    };
    const guild = clientBot.dbGuilds.get(interaction.guild?.id || '');
    const channelCategory = (await clientBot.channels.cache.get(id || '')) as CategoryChannel;

    if (
      id === null ||
      guild?.listAutoVoiceChannels === null ||
      channelCategory === undefined ||
      guild === undefined ||
      name === null
    ) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Remove Auto Voice Channel',
            description: 'Ocorreu um erro desconhecido.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    if (guild.listAutoVoiceChannels.filter(c => c.id === id).length === 0) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Remove Auto Voice Channel',
            description: `A categoria \`${name}\` não está na lista de canais automáticos.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return true;
    }

    guild.removeAutoVoiceChannel(id);

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'Remove Auto Voice Channel',
          description: `A categoria \`${name}\` foi removida na lista de canais automáticos.`,
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });

    return true;
  },
} as Command;
