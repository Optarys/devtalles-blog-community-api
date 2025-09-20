import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.model";
import { PostCommentEntity } from "./post_comment.model";
import { PostCategoryEntity } from "./post-category.model";
import { PostTagEntity } from "./post-tag.model";
import { PostStatus } from "./models.model";
import { PostSavedEntity } from "./post_saved.model";

@Entity('posts')
export class PostEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @ManyToOne(() => PostCategoryEntity, (cat) => cat.posts, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PostCategoryEntity;

  @Column({ name: 'banner_images', type: 'jsonb', nullable: true })
  bannerImages: string[];

  @Column({ name: 'seo_meta', type: 'jsonb', nullable: true })
  seoMeta: any;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ManyToMany(() => PostTagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag_map',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: PostTagEntity[];

  @OneToMany(() => PostCommentEntity, (comment) => comment.post)
  comments: PostCommentEntity[];

  @OneToMany(() => PostSavedEntity, saved => saved.post)
  savedPosts: PostSavedEntity[];
}