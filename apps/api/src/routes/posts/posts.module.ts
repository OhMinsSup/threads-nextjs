import { Module } from "@nestjs/common";

import { TagsService } from "../tags/services/tags.service";
import { UsersService } from "../users/services/users.service";
import { PostsController } from "./controllers/posts.controller";
import { PostsService } from "./services/posts.service";

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, TagsService],
})
export class PostsModule {}
