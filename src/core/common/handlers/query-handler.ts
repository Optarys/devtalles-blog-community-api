import { IQuery, Query } from "@nestjs/cqrs";
import { Result } from "../responses";

export type IQueryHandler<TQuery extends IQuery = any, TRes = any> = 
  TQuery extends Query<infer InferredQueryResult>
    ? {
        /**
         * Executes a query.
         * @param query The query to execute.
         */
        execute(query: TQuery): Promise<Result<InferredQueryResult>>;
      }
    : {
        /**
         * Executes a query.
         * @param query The query to execute.
         */
        execute(query: TQuery): Promise<Result<TRes>>;
      };
