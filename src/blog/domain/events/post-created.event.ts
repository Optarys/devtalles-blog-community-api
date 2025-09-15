export class PostCreatedDomainEvent {
    constructor(
        public readonly postId: number,
        public readonly title: string,
        public readonly authorId: string,
        public readonly occurredOn: Date = new Date(),
    ) { }
}
