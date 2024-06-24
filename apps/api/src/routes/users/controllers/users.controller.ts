import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/decorators/auth-user.decorator";

import type { UserExternalPayload } from "@thread/db/selectors";
import { HttpResultStatus } from "@thread/enum/result-status";

import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  get(@AuthUser() user: UserExternalPayload) {
    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: {
        user,
      },
    };
  }
}
