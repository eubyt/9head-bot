import { SlashCommandBuilder } from '@discordjs/builders';
import { TextChannel } from 'discord.js';
import Config from '@common/config';
import Command from '@commands/command';

export default {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Definir um intervalo de mensagens no canal de texto atual.')
    .addStringOption(opt =>
      opt
        .setName('time')
        .setRequired(true)
        .setDescription('Escolha o tempo de intervalo de mensagens.')
        .addChoice('desligado', '0')
        .addChoice('5s', '5')
        .addChoice('10s', '10')
        .addChoice('15s', '15')
        .addChoice('30s', '30')
        .addChoice('1m', '60')
        .addChoice('2m', '120')
        .addChoice('5m', '300')
        .addChoice('10m', '600')
        .addChoice('15m', '900')
        .addChoice('30m', '1800')
        .addChoice('1h', '3600')
        .addChoice('2h', '7200')
        .addChoice('6h', '21600'),
    ),
  async execute(clientBot, interaction) {
    const { channel } = interaction;
    const time = parseInt(interaction.options.getString('time') || '0', 10);
    (channel as TextChannel).setRateLimitPerUser(time);

    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'Slowmode',
          description: `Tempo de espera para enviar mensagens no canal: ${
            time === 0 ? 'Desligado' : `${time}s`
          }`,
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });
    return true;
  },
} as Command;
