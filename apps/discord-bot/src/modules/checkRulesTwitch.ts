import { Twitch } from '@9head/core-api';
import Logger from '@common/logger';
import GuildClass from '@src/guild';
import UserClass from '@src/user';
import { User } from 'discord.js';

const cache = new Map<string, number>();

const getTwitchRule = async (id: string) => {
  const twitchUser = await Twitch.getUserResolver(id);
  const users = await Twitch.getListModVip(twitchUser.displayName);
  return users;
};

const startRulesTwitch = async (guild: GuildClass, userDiscord: User) => {
  const time = cache.get(`${userDiscord.id}#${guild.guild.id}`);
  if (time !== undefined && time > new Date().getTime()) {
    return;
  }

  // Espera de 30 minutes por cada usuario
  // Para executar novamente
  cache.set(`${userDiscord.id}#${guild.guild.id}`, new Date().getTime() + 1000 * 60 * 30);

  const userDB = new UserClass(userDiscord);
  await userDB.init();

  if (guild.guildDatabase === undefined || guild.guildDatabase === null) return;
  if (
    guild.guildDatabase.discordTwitch === undefined ||
    guild.guildDatabase.discordTwitch === null ||
    guild.guildDatabase.discordTwitch.id === ''
  ) {
    return;
  }
  if (
    userDB.connectionTwitch === null ||
    userDB.connectionTwitch === undefined ||
    userDB.connectionTwitch.id === ''
  ) {
    return;
  }
  const { vips, mods } = await getTwitchRule(guild.guildDatabase.discordTwitch.id);
  const userTwitchID = userDB.connectionTwitch.id;
  const { modRuleID, vipRuleID } = guild.guildDatabase.discordTwitch;

  const isVIP = vips.some((vip: any) => vip.id === String(userTwitchID));
  const isMod = mods.some((mod: any) => mod.id === String(userTwitchID));

  const modRule = guild.guild.roles.cache.get(modRuleID);
  const vipRule = guild.guild.roles.cache.get(vipRuleID);
  const userGuild = guild.guild.members.cache.get(userDiscord.id);

  if (userGuild === undefined || userGuild === null) return;
  Logger.debug(`discordTwitchID: ${guild.guildDatabase.discordTwitch.id}`);
  Logger.debug(`twitch >> ${userDiscord.username} - ${userTwitchID}`);
  Logger.debug(`VIP: ${isVIP} - MOD: ${isMod}`);

  if (modRule !== undefined && modRule !== null) {
    if (!userGuild.roles.cache.has(modRule.id) && isMod) {
      userGuild.roles.add(modRule);
    } else if (!isMod) {
      userGuild.roles.remove(modRule);
    }
  }

  if (vipRule !== undefined && vipRule !== null) {
    if (!userGuild.roles.cache.has(vipRule.id) && isVIP) {
      userGuild.roles.add(vipRule);
    } else if (!isVIP) {
      userGuild.roles.remove(vipRule);
    }
  }
};

export default startRulesTwitch;
