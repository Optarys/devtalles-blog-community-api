import { ObjectType, Field, Int } from "@nestjs/graphql";
import { CommentType } from "./comment-type";

@ObjectType({ description: 'Representa las publicaciones dentro del blog' })
export class PostType {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => Int)
    authorId: number;

    @Field(() => [CommentType], { nullable: true })
    comments?: CommentType[];
}
