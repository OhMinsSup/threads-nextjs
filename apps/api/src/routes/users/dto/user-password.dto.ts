import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UserPasswordDTO {
  @IsString({
    message: "비밀번호는 문자열이어야 합니다.",
  })
  @MinLength(6, {
    message: "비밀번호는 6자 이상이어야 합니다.",
  })
  @MaxLength(100, {
    message: "비밀번호는 100자 이하여야 합니다.",
  })
  @ApiProperty({
    title: "Password",
    description: "The password of the user",
    maxLength: 100,
    minLength: 6,
    type: String,
    required: true,
  })
  readonly password: string;
}
