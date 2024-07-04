import { PickType } from "@nestjs/swagger";

import { EmailUserCreateDTO } from "../../users/dto/email-user-create.dto";

export class SigninDTO extends PickType(EmailUserCreateDTO, [
  "email",
  "password",
]) {}
