import Config from './config';

export default {
  error: (message: string) => ({
    embeds: [
      {
        color: Config.EMBED_COLOR,
        title: '🤔 Erro',
        description: message,
        timestamp: new Date(),
      },
    ],
    ephemeral: true,
  }),
};
