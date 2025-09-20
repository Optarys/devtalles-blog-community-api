import { PostCommentEntity } from "@core/persistence/models";

export class PostCommentedDomainEvent {
  constructor(
    public readonly postId: number,
    public readonly comment: PostCommentEntity,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
