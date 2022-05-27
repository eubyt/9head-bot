import { SlashCommandBuilder } from '@discordjs/builders';
import Config from '@common/config';
import Command from '@commands/command';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Visualizar a latência do bot.'),
  async execute(clientBot, interaction) {
    const apiTime = Math.round(clientBot.ws.ping);
    const responseTime = Math.abs(Date.now() - interaction.createdTimestamp);
    await interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: '🏓 Latência do bot',
          description:
            'Para verificar informações relacionadas a **latências do discord** acesse [discordstatus.com](https://discordstatus.com/).\nEssas são os resultado da latências do **bot 9Head**.',
          fields: [
            {
              name: 'API',
              value: `\`\`\`${apiTime}ms\`\`\``,
              inline: true,
            },
            {
              name: 'Resposta do Bot',
              value: `\`\`\`${responseTime}ms\`\`\``,
              inline: true,
            },
          ],
        },
      ],
      ephemeral: true,
    });
    return true;
  },
} as Command;
