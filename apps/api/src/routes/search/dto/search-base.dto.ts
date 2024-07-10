import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";

export enum PostSearchType {
  TAGS = "tags",
  DEFAULT = "default",
}

export class SearchBaseQuery {
  @IsOptionalString()
  @ApiProperty({
    name: "q",
    type: String,
    nullable: true,
    example: "Thread",
    required: false,
    description: "검색어",
  })
  readonly q?: string;

  @IsOptional()
  @IsEnum(PostSearchType, {
    message: "검색 타입은 tags 또는 default 중 하나여야 합니다.",
  })
  @ApiProperty({
    name: "searchType",
    enum: PostSearchType,
    example: "default",
    nullable: true,
    required: false,
    description: "검색 타입",
  })
  readonly searchType?: PostSearchType;
}
