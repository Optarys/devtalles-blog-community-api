import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.model";

@Entity('user_sessions')
export class UserSessionEntity {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'last_active_at', type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
  revokedAt: Date;
}
