import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { subMilliseconds } from "date-fns";

import { HttpResultStatus } from "@thread/sdk/enum";

import type { JwtPayload } from "../strategies/jwt.auth.strategy";
import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { AppTokenType } from "../../../libs/constants";
import { assertHttpError, isHttpError } from "../../../libs/error";
import { UsersService } from "../../../routes/users/services/users.service";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { SigninDTO } from "../dto/signin.dto";
import { SignupDTO } from "../dto/signup.dto";
import { VerifyTokenDTO } from "../dto/verify-token.dto";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

const generatorName = (seed: string) => {
  const makeRandomString = (length: number) => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  return `${seed}_${makeRandomString(10)}`;
};

@Injectable()
export class AuthService {
  private _contextName = "auth - service";

  constructor(
    private readonly env: EnvironmentService,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly token: TokenService,
    private readonly user: UsersService,
    private readonly password: PasswordService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * @description Verify Token Handler
   * @param {VerifyTokenDTO} input
   */
  async verifyToken(input: VerifyTokenDTO) {
    let jwtDto: JwtPayload;
    try {
      jwtDto = await this.jwt.verifyAsync<JwtPayload>(input.token, {
        secret: this.env.getAccessTokenSecret(),
      });
    } catch {
      assertHttpError(
        true,
        {
          resultCode: HttpResultStatus.TOKEN_EXPIRED,
          message: "Unauthorized",
          result: null,
        },
        "Unauthorized",
        HttpStatus.UNAUTHORIZED,
      );
    }

    assertHttpError(
      !jwtDto || (jwtDto && !jwtDto.sub),
      {
        resultCode: HttpResultStatus.TOKEN_EXPIRED,
        message: "Unauthorized",
        result: null,
      },
      "Unauthorized",
      HttpStatus.UNAUTHORIZED,
    );

    const user = await this.user.checkUserById(jwtDto.sub);
    assertHttpError(
      !user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: "user not found",
        result: null,
      },
      "Not Found",
      HttpStatus.NOT_FOUND,
    );

    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: true,
    };
  }

  /**
   * @description Refresh Handler
   * @param {RefreshTokenDTO} input
   */
  async refresh(input: RefreshTokenDTO) {
    let jwtDto: JwtPayload;
    try {
      jwtDto = await this.jwt.verifyAsync<JwtPayload>(input.refreshToken, {
        secret: this.env.getRefreshTokenSecret(),
      });
    } catch (e) {
      assertHttpError(
        e instanceof Error,
        {
          resultCode: HttpResultStatus.TOKEN_EXPIRED,
          message: e.message,
          result: null,
        },
        "Unauthorized",
        HttpStatus.UNAUTHORIZED,
      );
    }

    assertHttpError(
      !jwtDto || (jwtDto && !jwtDto.sub),
      {
        resultCode: HttpResultStatus.TOKEN_EXPIRED,
        message: "token sub invalid",
        result: null,
      },
      "Unauthorized",
      HttpStatus.UNAUTHORIZED,
    );

    assertHttpError(
      !jwtDto.jti,
      {
        resultCode: HttpResultStatus.TOKEN_EXPIRED,
        message: "token refresh jti invalid",
        result: null,
      },
      "Unauthorized",
      HttpStatus.UNAUTHORIZED,
    );

    const token = await this.token.findByTokenId(jwtDto.jti);
    assertHttpError(
      !token,
      {
        resultCode: HttpResultStatus.TOKEN_EXPIRED,
        message: "token not found",
        result: null,
      },
      "Not Found",
      HttpStatus.UNAUTHORIZED,
    );

    try {
      const user = await this.user.getUserById(jwtDto.sub);
      assertHttpError(
        !user,
        {
          resultCode: HttpResultStatus.NOT_EXIST,
          message: "user not found",
          result: null,
        },
        "Not Found",
        HttpStatus.NOT_FOUND,
      );

      // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
      await this.token.deleteByExpiresAtTokens({
        userId: user.id,
        expiresAt: subMilliseconds(token.expires.getTime(), 1000),
        tokenType: AppTokenType.RefreshToken,
      });

      const accessToken = this.token.generateAccessToken(user.id);
      const refreshToken = await this.token.generateRefreshToken(user.id);

      return {
        resultCode: HttpResultStatus.OK,
        message: null,
        error: null,
        result: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    } catch (error) {
      if (isHttpError(error)) {
        try {
          await this.token.deleteByTokenId(jwtDto.jti);
        } catch (error) {
          // Nothing to do
          this.logger.error(error, this._contextName);
        }
      }

      throw error;
    }
  }

  /**
   * @description Signin Handler
   * @param {SigninDTO} input
   */
  async signin(input: SigninDTO) {
    const user = await this.user.getInternalUserByEmail(input.email);

    assertHttpError(
      !user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: {
          email: {
            message: "가입되지 않은 이메일입니다.",
          },
        },
        error: "email",
        result: null,
      },
      "Not Found",
      HttpStatus.NOT_FOUND,
    );

    const isMatch = await this.password.compare(
      input.password,
      user.Password.salt,
      user.Password.hash,
    );

    assertHttpError(
      !isMatch,
      {
        resultCode: HttpResultStatus.INCORRECT_PASSWORD,
        message: {
          password: {
            message: "비밀번호가 일치하지 않습니다.",
          },
        },
        error: "password",
        result: null,
      },
      "Unauthorized",
      HttpStatus.UNAUTHORIZED,
    );

    const accessToken = this.token.generateAccessToken(user.id);
    const refreshToken = await this.token.generateRefreshToken(user.id);

    // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
    await this.token.deleteByExpiresAtTokens({
      userId: user.id,
      expiresAt: subMilliseconds(refreshToken.expiresAt.getTime(), 1000),
      tokenType: AppTokenType.RefreshToken,
    });

    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  /**
   * @description Signup Handler
   * @param {SignupDTO} input
   */
  async signup(input: SignupDTO) {
    const user = await this.user.checkUserByEmail(input.email);

    assertHttpError(
      !!user,
      {
        resultCode: HttpResultStatus.NOT_EXIST,
        message: {
          email: {
            message: "이미 가입된 이메일입니다.",
          },
        },
        error: "email",
        result: null,
      },
      "Bad Request",
      HttpStatus.BAD_REQUEST,
    );

    const { hashedPassword, salt } = await this.password.hashPassword(
      input.password,
    );

    const emailSplit = input.email.split("@").at(0) ?? "username";

    return await this.prisma.$transaction(async (tx) => {
      const user = await this.user.createUser(
        {
          email: input.email,
          name: input.name ?? generatorName(emailSplit),
          password: hashedPassword,
          salt: salt,
        },
        tx,
      );

      const accessToken = this.token.generateAccessToken(user.id);
      const refreshToken = await this.token.generateRefreshToken(user.id, tx);

      // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
      const conditionExpiredAt = subMilliseconds(
        refreshToken.expiresAt.getTime(),
        1000,
      );

      await this.token.deleteByExpiresAtTokens(
        {
          userId: user.id,
          expiresAt: conditionExpiredAt,
          tokenType: AppTokenType.RefreshToken,
        },
        tx,
      );

      return {
        resultCode: HttpResultStatus.OK,
        message: null,
        error: null,
        result: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    });
  }
}
