import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

import { UserPasswordDTO } from "./user-password.dto";

export class EmailUserCreateDTO extends UserPasswordDTO {
  @IsEmail(undefined, { message: "잘못된 이메일 형식입니다." })
  @ApiProperty({
    title: "Email",
    description: "The email of the user",
    example: "example@example.com",
    type: String,
    required: true,
  })
  readonly email: string;

  @IsOptional()
  @IsString({
    message: "이름은 문자열이어야 합니다.",
  })
  @MaxLength(50, {
    message: "이름은 50자 이하여야 합니다.",
  })
  @ApiProperty({
    title: "Name",
    description: "The name of the user",
    example: "John Doe",
    type: String,
    required: true,
  })
  readonly name?: string;

  @IsOptional()
  @IsString({
    message: "사용자의 이미지 URL은 문자열이어야 합니다.",
  })
  @IsUrl(undefined, {
    message: "잘못된 이미지 URL 형식입니다.",
  })
  @ApiProperty({
    title: "Image URL",
    description: "The URL of the user's avatar",
    example: "https://example.com/avatar.png",
    type: String,
    required: false,
  })
  readonly image?: string;
}
