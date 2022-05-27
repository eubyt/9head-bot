import Logger from '@common/logger';
import { User as UserDatabase, TwitchConnection } from '@9head/database';
import UserConections from '@util/userConections';
import { User } from 'discord.js';

class UserClass {
  public id: string;

  public name: string;

  public connectionTwitch: TwitchConnection | null;

  constructor(user: User) {
    this.id = user.id;
    this.name = `${user.username}#${user.discriminator}`;
    this.connectionTwitch = null;
  }

  public async init() {
    await this.checkUserExistInDatabase();
  }

  private setProperties(user: UserDatabase) {
    this.id = user.userId;
    this.connectionTwitch = user.connectionTwitch;
    Logger.debug(user);
  }

  private async checkUserExistInDatabase() {
    await UserDatabase.findOneBy({
      userId: this.id,
    })
      .then(guildData => {
        if (!guildData) {
          this.createDatabase();
        } else {
          this.setProperties(guildData);
          Logger.info(`Usuário '${this.id}' encontrado no banco de dados.`);
        }
      })
      .catch(err => {
        Logger.fatal(err);
      });
  }

  private createDatabase() {
    const userData = new UserDatabase();
    userData.userId = this.id;
    userData.connectionTwitch = new TwitchConnection('', '', '');
    userData
      .save()
      .then(() => {
        Logger.info(`Usuário '${this.id}' adicionado no banco de dados.`);
      })
      .catch(err => {
        Logger.fatal(err);
      });
  }

  public getLinkConnections(): string {
    return UserConections.createLinkConnection(this.id, this.name);
  }
}

export default UserClass;
