import { Column } from 'typeorm';

export default class TwitchConnection {
  @Column({ length: 90, nullable: false })
  id!: string;

  @Column({ nullable: false })
  access_token!: string;

  @Column({ nullable: false })
  refresh_token!: string;

  constructor(id: string, accessTwitch: string, refreshTwitch: string) {
    this.id = id;
    this.access_token = accessTwitch;
    this.refresh_token = refreshTwitch;
  }
}
