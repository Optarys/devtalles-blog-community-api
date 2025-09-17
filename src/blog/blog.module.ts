import { Module } from '@nestjs/common';
import { BlogResolver } from './presentation/graphql/blog.resolver';
import { PostsService } from './application/services/posts.service';
import { BlogContext } from './infrastructure/context';
import { CoreModule } from '@core/core.module';
import { StorageService } from './application/services';
import { S3StorageConfiguration } from './infrastructure/storage/s3-storage.configuration';
import { PostRepository } from './infrastructure/repositories';
import { PostsController } from './presentation/rest/post.controller';
import { JwtModule } from '@nestjs/jwt';
import { CreatePostHandler } from './application/features/createPost/create-post.handler';
import { AddCommentHandler } from './application/features/addComment/add-comment.handler';
import { CommentController } from './presentation/rest/comment.controller';

@Module({
  imports: [
    JwtModule,
    CoreModule,
    S3StorageConfiguration.register()
  ],
  providers: [
    BlogResolver,
    PostsService,
    BlogContext,
    StorageService,
    PostRepository,
    CreatePostHandler,
    AddCommentHandler
  ],
  controllers: [PostsController, CommentController]
})
export class BlogModule { }
