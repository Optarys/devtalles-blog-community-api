import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatusEntity } from "./user-status.model";
import { RoleEntity } from "./role.model";
import { UserIdentityEntity } from "./user-identity.model";
import { UserCredentialEntity } from "./user-credential.model";
import { UserSessionEntity } from "./user-session.model";
import { PostCommentEntity } from "./post_comment.model";
import { PostEntity } from "./post.model";
import { PostSavedEntity } from "./post_saved.model";

@Entity('users')
export class UserEntity {
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

  @ManyToOne(() => UserStatusEntity, (status) => status.users, { nullable: false })
  @JoinColumn({ name: 'status_id' })
  status: UserStatusEntity;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserCredentialEntity, (cred) => cred.user)
  credentials: UserCredentialEntity[];

  @OneToMany(() => UserIdentityEntity, (identity) => identity.user)
  identities: UserIdentityEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },

  })
  roles: RoleEntity[];

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => PostCommentEntity, (comment) => comment.user)
  comments: PostCommentEntity[];

  @OneToMany(() => UserSessionEntity, (session) => session.user)
  sessions: UserSessionEntity[];

  @OneToMany(() => PostSavedEntity, saved => saved.user)
  savedPosts: PostSavedEntity[];
}