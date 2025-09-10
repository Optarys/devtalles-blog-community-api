import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { PostCategory } from "./post-category.model";
import { PostTag } from "./post-tag.model";

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 50, default: 'draft' })
  status: string;

  @ManyToOne(() => PostCategory, (cat) => cat.posts, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PostCategory;

  @Column({ name: 'seo_meta', type: 'jsonb', nullable: true })
  seoMeta: any;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ManyToMany(() => PostTag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag_map',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: PostTag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}