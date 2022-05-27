import Command from '@commands/command';
import Config from '@common/config';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('remove-twitch-channel')
    .setDescription('Remover um canal da Twitch nesse servidor Discord.'),
  async execute(clientBot, interaction) {
    const discordOwner = interaction.guild?.ownerId;
    const guild = clientBot.dbGuilds.get(interaction.guildId || '');
    if (discordOwner !== interaction.user.id) {
      interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Acesso negado',
            description: 'Você não é o dono do servidor.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return false;
    }

    guild?.setTwitch('');
    interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'removeTwitchChannel',
          description: 'Você removeu o canal da Twitch com sucesso.',
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });

    return true;
  },
} as Command;
