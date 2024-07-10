import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import type { UserExternalPayload } from "@thread/db/selectors";

import {
  AuthUser,
  OptionalAuthUser,
} from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt.auth.guard";
import { OptionalJwtAuth } from "../../../guards/optional-jwt.auth.guard";
import { PostListQuery } from "../dto/post-list.dto";
import { PublishDTO } from "../dto/publish.dto";
import { PostsService } from "../services/posts.service";

@ApiTags("게시글")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  @ApiOperation({ summary: "게시글 목록" })
  @ApiQuery({
    required: true,
    description: "게시글 목록 쿼리",
    type: PostListQuery,
  })
  @OptionalJwtAuth()
  async list(
    @Query() query: PostListQuery,
    @OptionalAuthUser() user: UserExternalPayload | null,
  ) {
    return this.service.list(query, user);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post()
  @ApiOperation({ summary: "게시글 작성" })
  @ApiBody({
    required: true,
    description: "게시글 작성 API",
    type: PublishDTO,
  })
  @JwtAuth()
  publish(@Body() body: PublishDTO, @AuthUser() user: UserExternalPayload) {
    return this.service.publish(body, user);
  }
}
