import { Column } from 'typeorm';

export default class AutoVoiceChannel {
  @Column({ length: 90, nullable: false })
  id!: string;

  @Column({ length: 60 })
  name!: string;

  @Column({
    default: 0,
  })
  userLimit!: number;

  constructor(id: string, name: string, userLimit: number) {
    this.id = id;
    this.name = name;
    this.userLimit = userLimit;
  }
}
