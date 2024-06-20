import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { HttpResultStatus } from "@thread/enum/result-status";
import { generatorName } from "@thread/shared/utils";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { assertHttpError } from "../../../libs/error";
import { UsersService } from "../../../routes/users/services/users.service";
import { SignupDTO } from "../dto/signup.dto";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
  private _contextName = "auth - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly token: TokenService,
    private readonly user: UsersService,
    private readonly password: PasswordService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async signup(input: SignupDTO) {
    const user = await this.user.getInternalUserByEmail(input.email);

    assertHttpError(
      !!user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: "이미 가입된 이메일입니다.",
        error: "email",
        result: null,
      },
      "이미 가입된 이메일입니다.",
      HttpStatus.BAD_REQUEST,
    );

    const hash = this.password.hash(input.password);

    const emailSplit = input.email.split("@").at(0) ?? "username";

    const signupData = {
      email: input.email,
      name: generatorName(emailSplit),
      password: hash,
    };

    return await this.prisma.$transaction(async (tx) => {
      const user = await this.user.createUser(signupData, tx);

      const accessToken = await this.token.generateAccessToken(user.id);
      // const refreshToken = await this.tokenService.generateRefreshToken(user.id);

      return {
        resultCode: HttpResultStatus.OK,
        message: null,
        error: null,
        result: {
          userId: user.id,
          tokens: {
            accessToken,
          },
        },
      };
    });
  }
}
