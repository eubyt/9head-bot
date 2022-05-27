import Logger from '@common/logger';
import { CategoryChannel, Client, VoiceChannel, VoiceState } from 'discord.js';
import GuildClass from '@src/guild';
import ClientBot from '../client';

const listChannelEmpty = (category: CategoryChannel) =>
  category.children.filter(x => x.members.size === 0 && x.type === 'GUILD_VOICE');

const createChannel = async (
  clientBot: Client,
  parentID: string,
  name: string,
  userLimit: number,
  numberAdd: number,
) => {
  const channel = (await clientBot.channels.cache.get(parentID)) as CategoryChannel;
  if (channel === undefined) return false;
  const allChannels = await channel.children.filter(x => x.type === 'GUILD_VOICE');
  const number = allChannels.size + 1 + numberAdd;
  const newName = () => `${name} #${number}`;
  Logger.debug(
    {
      parentID,
      guild: channel.guildId,
    },
    `Total de canais de voz vazios: ${listChannelEmpty(channel).size}`,
  );
  if (listChannelEmpty(channel).size !== 0) return false;

  const channelExist = allChannels.find(x => x.name === newName());
  if (channelExist) {
    Logger.debug(
      {
        parentID,
        guild: channel.guildId,
      },
      `Nome do canal de voz temporário já existe ${newName()}, gerando outro nome...`,
    );
    createChannel(clientBot, channel.id, name, userLimit, numberAdd + 1);
    return false;
  }
  Logger.info(
    {
      parentID,
      guild: channel.guildId,
    },
    `Criando canal de voz temporário ${newName()}`,
  );

  await channel.guild.channels.create(newName(), {
    type: 'GUILD_VOICE',
    parent: channel.id,
    userLimit,
  });

  return true;
};

const deleteChannelEmpty = async (clientBot: Client, parentID: string) => {
  const channel = (await clientBot.channels.cache.get(parentID)) as CategoryChannel;
  if (channel === undefined) return false;
  const allChannels = await channel.children.filter(x => x.type === 'GUILD_VOICE').reverse();
  if (listChannelEmpty(channel).size === 1) return true;
  let stopForEach = false;

  await allChannels.map(async x => {
    if (stopForEach) return;
    if (allChannels.last()?.id === x.id) {
      Logger.debug(
        {
          id: x.id,
          guild: channel.guildId,
        },
        `Pausando para não deletar o canal de voz temporário ${
          allChannels.last()?.name
        } (o último canal de voz da categoria)`,
      );
      return;
    }
    if (x.members.size === 0) {
      if (allChannels.filter(y => y.members.size === 0).size === 1) {
        stopForEach = true;
        Logger.debug(
          {
            id: x.id,
            guild: channel.guildId,
          },
          `Pausando para não deletar o ${x.name} (último canal de voz vazio temporário)`,
        );
      } else {
        Logger.info(
          {
            id: x.id,
            guild: channel.guildId,
          },
          `Deletando o canal de voz temporário ${x.name}`,
        );
        allChannels.delete(x.id);
        await x.delete();
      }
    } else {
      stopForEach = true;
      Logger.debug(
        {
          id: x.id,
          guild: channel.guildId,
        },
        `O canal de voz temporário ${x.name} não está vázio (Pausando remoção para não bagunçar a ordem dos canais)`,
      );
    }
  });
  return true;
};

export default {
  checkChannels: (clientBot: Client, guildClass: GuildClass) => {
    guildClass.listAutoVoiceChannels.forEach(x => {
      Logger.debug('Verificando se o canal de voz está vazio...');
      createChannel(clientBot, x.id, x.name, x.userLimit, 0);
      deleteChannelEmpty(clientBot, x.id);
    });
  },
  event: (clientBot, oldState, newState) => {
    const guilddb = clientBot.dbGuilds.get(newState.guild.id || oldState.guild.id);
    if (guilddb === undefined) return false;
    const { listAutoVoiceChannels } = guilddb;
    if (listAutoVoiceChannels === []) return false;

    const { channel } = oldState?.channel?.id === undefined ? newState : oldState;
    if (channel === undefined) return false;
    const { parentId } = channel as VoiceChannel;
    if (parentId === null) return false;

    const voiceChannel = listAutoVoiceChannels.find(x => x.id === parentId);
    if (voiceChannel) {
      if (newState?.channel?.id !== undefined) {
        createChannel(clientBot, parentId, voiceChannel.name, voiceChannel.userLimit, 0);
      }
      if (oldState?.channel?.id !== undefined) deleteChannelEmpty(clientBot, parentId);
      return true;
    }

    return true;
  },
} as {
  checkChannels: (clientBot: Client, guildClass: GuildClass) => void;
  event: (clientBot: ClientBot, oldState: VoiceState, newState: VoiceState) => void;
};
