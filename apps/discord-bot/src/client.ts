import { Client, Intents, Collection } from 'discord.js';
import Command from '@commands/command';
import GuildClass from 'guild';

class ClientBot extends Client {
  public commands: Collection<string, Command> = new Collection();

  public dbGuilds: Collection<string, GuildClass> = new Collection();

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });
  }
}

export default ClientBot;
