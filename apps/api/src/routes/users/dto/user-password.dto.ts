import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UserPasswordDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiProperty({
    title: "Password",
    description: "The password of the user",
    maxLength: 100,
    minLength: 6,
    type: String,
    required: true,
  })
  password: string;
}
