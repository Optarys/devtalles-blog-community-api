import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.model";

@Entity('post_tags')
export class PostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: PostEntity[];
}