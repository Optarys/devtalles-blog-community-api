import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: 'Representa el comentario de una publicación' })
export class CommentType {

    @Field()
    id:number;
    
    @Field()
    authorName: string;

    @Field()
    authorEmail: string;

    @Field()
    content: string;

    @Field()
    isModerated: boolean;

    @Field()
    createdAt: Date;
}