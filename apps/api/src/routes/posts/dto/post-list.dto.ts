import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";
import { PaginationQuery } from "../../../dto/pagination.query";

export enum PostSearchType {
  TAGS = "tags",
  DEFAULT = "default",
}

export class PostListQuery extends PaginationQuery {
  @IsOptionalString()
  @ApiProperty({
    name: "q",
    type: String,
    example: "Thread",
    required: false,
    description: "검색어",
  })
  q?: string;

  @IsOptional()
  @IsEnum(PostSearchType, {
    message: "검색 타입은 tags 또는 default 중 하나여야 합니다.",
  })
  @ApiProperty({
    name: "searchType",
    type: PostSearchType,
    example: "default",
    required: false,
    description: "검색 타입",
  })
  searchType?: PostSearchType;
}
