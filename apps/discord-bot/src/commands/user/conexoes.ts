import { SlashCommandBuilder } from '@discordjs/builders';
import Command from '@commands/command';
import UserClass from '@src/user';
import Config from '@common/config';

export default {
  data: new SlashCommandBuilder()
    .setName('conexoes')
    .setDescription('Ver minha lista de conexões.'),
  async execute(clientBot, interaction) {
    const user = new UserClass(interaction.user);
    await user.init();
    const link = user.getLinkConnections();

    interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'Suas conexões',
          description: `[Clique aqui](${link}) para conectar com sua twitch.`,
          timestamp: new Date(),
        },
      ],
    });
    return true;
  },
} as Command;
