import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class RefreshTokenDTO {
  @IsJWT({
    message: "잘못된 토큰 형식입니다.",
  })
  @ApiProperty({
    title: "Refresh Token",
    description: "The refresh token of the user",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    type: String,
    required: true,
  })
  readonly refreshToken: string;
}
