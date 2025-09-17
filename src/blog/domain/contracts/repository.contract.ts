export interface IRepository<TEntity> {

    save(entity: TEntity): Promise<TEntity>;
}