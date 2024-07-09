import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class PaginationQuery {
  @Type(() => Number)
  @IsNumber(undefined, {
    message: "limit은 숫자여야 합니다.",
  })
  @Max(100, {
    message: "limit은 100 이하여야 합니다.",
  })
  @ApiProperty({
    name: "limit",
    type: Number,
    required: true,
    example: 10,
    description: "페이지 크기",
  })
  readonly limit: number;

  @Type(() => Number)
  @IsNumber(undefined, {
    message: "pageNo은 숫자여야 합니다.",
  })
  @Min(1, {
    message: "pageNo은 1 이상이어야 합니다.",
  })
  @ApiProperty({
    name: "pageNo",
    type: Number,
    required: true,
    example: 1,
    description: "페이지 번호",
  })
  readonly pageNo: number;
}
