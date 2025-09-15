import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.model";
import { PostEntity } from "./post.model";

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'author_name', length: 150, nullable: true })
  authorName: string;

  @Column({ name: 'author_email', length: 255, nullable: true })
  authorEmail: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_moderated', default: false })
  isModerated: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}