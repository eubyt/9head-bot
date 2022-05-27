import Config from '@common/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command from '@commands/command';
import { Pastebin } from '@9head/core-api';

export default {
  data: new SlashCommandBuilder().setName('banlist').setDescription('Lista os usuários banidos.'),
  async execute(clientBot, interaction) {
    await interaction.deferReply({ ephemeral: true });
    const banList = await interaction.guild?.bans.fetch();

    const pastbin = new Pastebin(Config.PASTEBIN_API_KEY);
    const linkPastbin = await pastbin.createPaste(
      banList
        ?.map(ban =>
          JSON.stringify({
            userId: ban.user.id,
            user: ban.user.tag,
            discriminator: ban.user.discriminator,
            reason: ban.reason || 'Sem motivo',
          }),
        )
        .join('\n') || 'Não há usuários banidos.',
      `${interaction.guild?.name} - Banlist`,
      'json',
    );

    interaction.editReply({
      embeds: [
        {
          color: Config.EMBED_COLOR,
          title: `Lista de banidos do servidor - ${banList?.size} usuário(s)`,
          description: `[Clique aqui](${linkPastbin}) para visualizar a lista.\nObervação: A lista é **privada** e expira em **10 minutos**.`,
          timestamp: new Date(),
        },
      ],
    });

    return true;
  },
} as Command;
