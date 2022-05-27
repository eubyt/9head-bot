/* eslint-disable @typescript-eslint/naming-convention */
import { Guild } from 'discord.js';
import { AutoVoiceChannel, Guild as GuildDatabase, TwitchDiscord } from '@9head/database';
import Logger from '@common/logger';
import ModuleAutoVoiceChannel from '@module/autoVoiceChannel';

interface listAutoVoiceChannelsType {
  id: string;
  name: string;
  userLimit: number;
}

class GuildClass {
  public guild: Guild;

  public listAutoVoiceChannels: Array<listAutoVoiceChannelsType>;

  public guildDatabase: GuildDatabase | null;

  constructor(guild: Guild) {
    this.guild = guild;
    this.listAutoVoiceChannels = [];
    this.guildDatabase = null;
  }

  public async init() {
    await this.checkGuildExistInDatabase();
  }

  private setProperties(guild: GuildDatabase) {
    this.listAutoVoiceChannels = guild.autoVoiceChannels as Array<listAutoVoiceChannelsType>;
    this.guildDatabase = guild;

    // Fazer check dos Modulo
    ModuleAutoVoiceChannel.checkChannels(this.guild.client, this);

    Logger.debug(guild);
  }

  private async checkGuildExistInDatabase() {
    await GuildDatabase.findOneBy({
      guildId: this.guild.id,
    })
      .then(guildData => {
        if (!guildData) {
          this.createDatabase();
        } else {
          this.setProperties(guildData);
          Logger.info(`Guild '${this.guild.id}' encontrado no banco de dados.`);
        }
      })
      .catch(err => {
        Logger.fatal(err);
      });
  }

  private createDatabase() {
    const guildData = new GuildDatabase();
    guildData.guildId = this.guild.id;
    guildData.name = this.guild.name;
    guildData.autoVoiceChannels = [];
    guildData.discordTwitch = new TwitchDiscord('');
    guildData
      .save()
      .then(() => {
        Logger.info(`Guild '${this.guild.id}' adicionado no banco de dados.`);
      })
      .catch(err => {
        Logger.fatal(err);
      });
  }

  public async addAutoVoiceChannel(autoVoiceChannel: AutoVoiceChannel) {
    if (this.guildDatabase === null) return;
    this.listAutoVoiceChannels.push(autoVoiceChannel);
    this.guildDatabase.autoVoiceChannels = this.listAutoVoiceChannels;
    ModuleAutoVoiceChannel.checkChannels(this.guild.client, this);
    this.guildDatabase.save();
  }

  public async removeAutoVoiceChannel(id: string) {
    if (this.guildDatabase === null) return;
    this.listAutoVoiceChannels = this.listAutoVoiceChannels.filter(x => x.id !== id);
    this.guildDatabase.autoVoiceChannels = this.listAutoVoiceChannels;
    ModuleAutoVoiceChannel.checkChannels(this.guild.client, this);
    this.guildDatabase.save();
  }

  public async setTwitch(id: string) {
    if (this.guildDatabase === null) return;
    this.guildDatabase.discordTwitch = new TwitchDiscord(id);
    await this.guildDatabase.save();
  }

  public async setTwitchRoles(vipID: string, modID: string) {
    if (this.guildDatabase === null) return;
    if (
      this.guildDatabase.discordTwitch === undefined ||
      this.guildDatabase.discordTwitch === null ||
      this.guildDatabase.discordTwitch.id === ''
    ) {
      return;
    }
    this.guildDatabase.discordTwitch.vipRuleID = vipID;
    this.guildDatabase.discordTwitch.modRuleID = modID;
    await this.guildDatabase.save();
  }
}

export default GuildClass;
