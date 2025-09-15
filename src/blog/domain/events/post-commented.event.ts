import { CommentEntity } from "@core/persistence/models";

export class PostCommentedDomainEvent {
  constructor(
    public readonly postId: number,
    public readonly comment: CommentEntity,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
