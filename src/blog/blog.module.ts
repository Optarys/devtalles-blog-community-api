import { Module } from '@nestjs/common';
import { BlogResolver } from './presentation/graphql/blog.resolver';
import { PostsService } from './application/services/posts.service';
import { BlogContext } from './infrastructure/context';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  providers: [BlogResolver, PostsService, BlogContext]
})
export class BlogModule { }
