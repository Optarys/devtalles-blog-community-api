import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SavedPostsType {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    savedAt: Date
}