import 'dotenv/config';

export default {
  DISCORD_TOKEN: String(process.env.DISCORD_TOKEN),
  DISCORD_CLIENT_ID: String(process.env.DISCORD_CLIENT_ID),
  LOG_LEVEL: String(process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  EMBED_COLOR: 12151973,
  MONGO_URL: String(process.env.MONGO_URL),
  IS_DEV: Boolean(process.env.NODE_ENV === 'development'),
  IS_PROD: Boolean(process.env.NODE_ENV === 'production'),
  PASTEBIN_API_KEY: String(process.env.PASTEBIN_API_KEY),
  JWT_TOKEN: String(process.env.JWT_TOKEN),
  TWITCH_CLIENT_ID: String(process.env.TWITCH_CLIENT_ID),
};
