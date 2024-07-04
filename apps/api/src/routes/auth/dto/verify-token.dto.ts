import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class VerifyTokenDTO {
  @IsJWT({
    message: "잘못된 토큰 형식입니다.",
  })
  @ApiProperty({
    title: "Token",
    description: "The token to verify",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    type: String,
    required: true,
  })
  readonly token: string;
}
