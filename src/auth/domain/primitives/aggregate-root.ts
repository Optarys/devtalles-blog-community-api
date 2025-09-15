export abstract class AggregateRoot {
    private domainEvents: any[] = [];

    protected addDomainEvent(event: any) {
        this.domainEvents.push(event);
    }

    public pullDomainEvents(): any[] {
        const events = [...this.domainEvents];
        this.domainEvents = [];
        return events;
    }
}
