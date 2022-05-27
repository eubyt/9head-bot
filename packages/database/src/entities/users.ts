import { BaseEntity, Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';
import TwitchConnection from '../sub_documents/twitchConnection';

@Entity()
export default class User extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Index({ unique: true })
  @Column({ length: 90, nullable: false })
  userId!: string;

  @Column(() => TwitchConnection)
  connectionTwitch!: TwitchConnection;
}
