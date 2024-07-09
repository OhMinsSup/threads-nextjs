import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class PublishDTO {
  @IsString({
    message: "게시글은 문자열이어야 합니다.",
  })
  @MinLength(1, {
    message: "게시글은 최소 1글자 이상이어야 합니다.",
  })
  @MaxLength(1000, {
    message: "게시글은 최대 1000글자 이하여야 합니다.",
  })
  @ApiProperty({
    title: "Text",
    description: "The text of the post",
    example: "Hello, world!",
    type: String,
    required: true,
  })
  readonly text: string;

  @IsArray({
    message: "해시태그는 배열이어야 합니다.",
  })
  @Type(() => String)
  @ArrayMaxSize(5, {
    message: "해시태그는 최대 5개까지만 가능합니다.",
  })
  @ArrayUnique(undefined, { message: "해시태그는 중복되지 않아야 합니다." })
  @ApiProperty({
    title: "Hash tags",
    description: "The hash tags of the post",
    type: [String],
    required: true,
    example: ["#nestjs", "#javascript"],
    maxItems: 5,
  })
  readonly hashTags: string[];

  @IsArray({
    message: "멘션은 배열이어야 합니다.",
  })
  @Type(() => String)
  @ArrayMaxSize(5, {
    message: "멘션은 최대 5개까지만 가능합니다.",
  })
  @ArrayUnique(undefined, { message: "멘션은 중복되지 않아야 합니다." })
  @ApiProperty({
    title: "Mentions",
    description: "The mentions of the post",
    type: [String],
    required: true,
    example: ["@user1", "@user2"],
    maxItems: 5,
  })
  readonly mentions: string[];

  @IsOptional()
  @IsObject({
    message: "메타는 객체이어야 합니다.",
  })
  @ApiProperty({
    title: "Meta",
    description: "The meta data of the post",
    type: Object,
    required: false,
  })
  readonly meta?: Record<string, any>;
}
