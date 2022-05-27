import { BaseEntity, Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';
import TwitchDiscord from '../sub_documents/twitchDiscord';
import AutoVoiceChannels from '../sub_documents/autoVoiceChannels';

@Entity()
export default class Guild extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Index({ unique: true })
  @Column({ length: 90, nullable: false })
  guildId!: string;

  @Column({ length: 90 })
  name!: string;

  @Column(() => TwitchDiscord)
  discordTwitch!: TwitchDiscord;

  @Column(() => AutoVoiceChannels)
  autoVoiceChannels!: AutoVoiceChannels[];
}
