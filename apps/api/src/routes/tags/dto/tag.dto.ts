import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class TagDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty({
    title: "Name",
    description: "The name of the tag",
    example: "NestJS",
    type: String,
    required: true,
  })
  readonly name: string;
}
