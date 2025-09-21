import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from './application/services/posts.service';
import { BlogContext } from './infrastructure/context';
import { CoreModule } from '@core/core.module';
import { StorageService } from './application/services';
import { S3StorageConfiguration } from './infrastructure/storage/s3-storage.configuration';
import { PostRepository } from './infrastructure/repositories';

//Handlers
import { CreatePostHandler } from './application/features/createPost/create-post.handler';
import { AddCommentHandler } from './application/features/addComment/add-comment.handler';
import { DeleteCommentHandler } from './application/features/deleteComment/delete-comment.handler';
import { TogglePostHandler } from './application/features/togglePost/toggle-post.handler';
import { SavePostHandler } from './application/features/savePost/save-post.handler';
import { EditPostHandler } from './application/features/editPost/edit-post.handler';

//Controllers
import { PostsController } from './presentation/rest/post.controller';
import { CommentController } from './presentation/rest/comment.controller';

//Graphql
import { BlogResolver } from './presentation/graphql/blog.resolver';


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
    AddCommentHandler,
    DeleteCommentHandler,
    TogglePostHandler,
    SavePostHandler,
    EditPostHandler
  ],
  controllers: [PostsController, CommentController]
})
export class BlogModule { }
