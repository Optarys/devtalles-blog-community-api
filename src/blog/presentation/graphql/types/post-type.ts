import { ObjectType, Field, Int } from "@nestjs/graphql";
import { CommentType } from "./comment-type";
import { TagType } from "./tag-type";
import { CategoryType } from "./category-type";
import GraphQLJSON from 'graphql-type-json';

@ObjectType({ description: 'Representa las publicaciones dentro del blog' })
export class PostType {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    slug: string;

    @Field(() => CategoryType, {nullable: true})
    category?: CategoryType;

    @Field()
    content: string;

    @Field()
    authorId: string;

    @Field(() => GraphQLJSON, { nullable: true })
    seoMeta: any;

    @Field()
    publishedAt: Date;

    @Field(() => [CommentType], { nullable: true })
    comments?: CommentType[];

    @Field(() => [TagType], { nullable: true })
    tags?: TagType[];
}
