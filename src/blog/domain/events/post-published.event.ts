export class PostPublishedDomainEvent {
  constructor(
    public readonly postId: number,
    public readonly publishedAt: Date,
  ) {}
}
