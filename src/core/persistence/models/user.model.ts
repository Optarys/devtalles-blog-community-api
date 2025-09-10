import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "./user-status.model";
import { Role } from "./role.model";
import { UserIdentity } from "./user-identity.model";
import { UserCredential } from "./user-credential.model";
import { UserSession } from "./user-session.model";
import { Comment } from "./comment.model";
import { Post } from "./post.model";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { name: 'external_id', default: () => 'uuid_generate_v4()' })
  externalId: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 100, nullable: true })
  username: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => UserStatus, (status) => status.users, { nullable: false })
  @JoinColumn({ name: 'status_id' })
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserCredential, (cred) => cred.user)
  credentials: UserCredential[];

  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: UserIdentity[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];
}