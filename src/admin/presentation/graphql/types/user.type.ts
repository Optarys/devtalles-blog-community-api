import { Field, ID, ObjectType } from "@nestjs/graphql";
import { RoleType } from "./role.type";
import { StatusType } from "./status.type";
import { SavedPostsType } from "./saved-posts.type";
import { PostUserType } from "./post-user.type";
import { PostCommentType } from "./post-comment.type";

@ObjectType({ description: 'Representa la información de un usuario.' })
export class UserType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  externalId: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => StatusType)
  status: StatusType;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => [RoleType])
  roles: RoleType[];

  @Field(() => [PostUserType], { nullable: true })
  posts?: PostUserType[];

  @Field(() => [PostCommentType], { nullable: true })
  comments?: PostCommentType[];

  @Field(() => [SavedPostsType], { nullable: true })
  savedPosts?: SavedPostsType[];
}
