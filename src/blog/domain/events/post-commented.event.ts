import { Comment } from "@core/persistence/models";

export class PostCommentedDomainEvent {
  constructor(
    public readonly postId: number,
    public readonly comment: Comment,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
