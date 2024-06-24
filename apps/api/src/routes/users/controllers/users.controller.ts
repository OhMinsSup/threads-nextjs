import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/decorators/auth-user.decorator";

import { HttpResultStatus } from "@thread/enum/result-status";

import type { UserExternalPayload } from "../../../integrations/prisma/selectors/users.selector";
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
