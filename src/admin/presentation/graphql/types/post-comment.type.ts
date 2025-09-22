import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostCommentType {
    @Field(() => Int)
    id: number;

    @Field()
    content: string;

    @Field()
    isModerated: boolean;

    @Field()
    createdAt: Date;

}