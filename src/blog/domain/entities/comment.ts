export class Comment {
  constructor(
    private readonly id: number,
    private readonly postId: number,
    private readonly authorId: string,
    private readonly content: string,
    private readonly createdAt: Date = new Date(),
  ) {}

  getId(): number {
    return this.id;
  }

  getPostId(): number {
    return this.postId;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
