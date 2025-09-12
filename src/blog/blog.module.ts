import { Module } from '@nestjs/common';
import { BlogResolver } from './presentation/graphql/blog/blog.resolver';

@Module({
  providers: [BlogResolver]
})
export class BlogModule {}
