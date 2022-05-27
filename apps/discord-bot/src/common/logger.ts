import Pino from 'pino';
import Config from './config';

const Logger = Pino({
  level: Config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
    },
  },
});

export default Logger;
