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
  @IsEmail()
  @ApiProperty({
    title: "Email",
    description: "The email of the user",
    example: "example@example.com",
    type: String,
    required: true,
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    title: "Name",
    description: "The name of the user",
    example: "John Doe",
    type: String,
    required: true,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty({
    title: "Image URL",
    description: "The URL of the user's avatar",
    example: "https://example.com/avatar.png",
    type: String,
    required: false,
  })
  image?: string;
}
