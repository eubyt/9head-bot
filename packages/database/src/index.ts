import { DataSource } from 'typeorm';
import AutoVoiceChannel from './sub_documents/autoVoiceChannels';
import TwitchConnection from './sub_documents/twitchConnection';
import TwitchDiscord from './sub_documents/twitchDiscord';
import Guild from './entities/guilds';
import User from './entities/users';

let AppDataSource: DataSource;
export { Guild, User };
// SubDocument
export { AutoVoiceChannel, TwitchConnection, TwitchDiscord };

export const getAppDataSource = () => AppDataSource;
export const startDataSource = (MONGO_URL: string) =>
  new Promise((resolve, reject) => {
    AppDataSource = new DataSource({
      type: 'mongodb',
      url: MONGO_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
      entities: [Guild, User],
      subscribers: [],
      migrations: [],
    });
    AppDataSource.initialize()
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
