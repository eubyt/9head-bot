import { Column } from 'typeorm';

export default class TwitchDiscord {
  @Column({ nullable: false })
  id!: string;

  @Column()
  modRuleID!: string;

  @Column()
  vipRuleID!: string;

  constructor(id: string) {
    this.id = id;
  }
}
