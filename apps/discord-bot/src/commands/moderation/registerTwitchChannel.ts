import Command from '@commands/command';
import Config from '@common/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import UserClass from '@src/user';

export default {
  data: new SlashCommandBuilder()
    .setName('register-twitch-channel')
    .setDescription('Registra um canal da Twitch nesse servidor Discord.')
    .addRoleOption(opt =>
      opt
        .setName('role-vip')
        .setDescription('Definir um cargo para o usuário VIP.')
        .setRequired(true),
    )
    .addRoleOption(opt =>
      opt
        .setName('role-mod')
        .setDescription('Definir um cargo para o usuário MOD.')
        .setRequired(true),
    ),
  async execute(clientBot, interaction) {
    const discordOwner = interaction.guild?.ownerId;
    const guild = clientBot.dbGuilds.get(interaction.guildId || '');
    const roleVIP = interaction.options.getRole('role-vip');
    const roleMod = interaction.options.getRole('role-mod');
    if (roleVIP === undefined || roleVIP === null || roleMod === undefined || roleMod === null) {
      await interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Register Twitch Channel',
            description:
              'Você precisa de um cargo VIP e um cargo MOD para registrar um canal Twitch.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return false;
    }
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
    const user = new UserClass(interaction.user);
    await user.init();
    if (
      user.connectionTwitch === null ||
      user.connectionTwitch === undefined ||
      user.connectionTwitch.id === ''
    ) {
      interaction.reply({
        embeds: [
          {
            color: Config.EMBED_COLOR,
            title: 'Erro',
            description:
              'Você não está conectado a uma conta Twitch. Para conectar, use o comando `/conexoes`.',
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      return false;
    }

    await guild?.setTwitch(user.connectionTwitch?.id);
    await guild?.setTwitchRoles(roleVIP.id, roleMod.id);
    interaction.reply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: 'registerTwitchChannel',
          description: 'Você registrou o canal da Twitch com sucesso.',
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });

    return true;
  },
} as Command;
