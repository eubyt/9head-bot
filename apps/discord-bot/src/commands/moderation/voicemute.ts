import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';
import Logger from '@common/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('voice-mute')
    .setDescription('Mutar um usuário dos canais de voz.')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Usuário que você quer mutar').setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const user = interaction.options.getMember('user') as GuildMember;

    try {
      if (user.voice.channel) {
        user.voice.setMute(true);
        await interaction.reply({
          embeds: [
            {
              color: Config.EMBED_COLOR,
              title: 'Voice mute',
              description: `O usuário ${user.nickname} foi mutado dos canais de voz.`,
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
              title: 'Voice mute',
              description: `O usuário ${user.nickname} não está em um canal de voz.`,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });
      }
    } catch (err) {
      Logger.error(err);
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Voice mute',
            description: `O bot não tem permissão para mutar o usuário ${user.nickname}.`,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
    return true;
  },
} as Command;
