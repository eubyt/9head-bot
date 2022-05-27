import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';

export default {
  data: new SlashCommandBuilder()
    .setName('voice-unmute')
    .setDescription('Desmutar um usuário dos canais de voz.')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Usuário que você quer desmutar').setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const user = interaction.options.getMember('user') as GuildMember;
    if (user.voice.channel) {
      user.voice.setMute(false);
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Voice unmute',
            description: `O usuário ${user.nickname} foi desmutado dos canais de voz.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Voice unmute',
            description: `O usuário ${user.nickname} não está em um canal de voz.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
    return true;
  },
} as Command;
