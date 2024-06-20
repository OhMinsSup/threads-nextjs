import { PickType } from "@nestjs/swagger";
import { EmailUserCreateDTO } from "src/routes/users/dto/email-user-create.dto";

export class SignupDTO extends PickType(EmailUserCreateDTO, [
  "email",
  "password",
]) {}
