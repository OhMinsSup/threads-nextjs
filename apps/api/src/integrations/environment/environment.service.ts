import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { addMilliseconds } from "date-fns";
import ms from "ms";

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  // -----------------------------------------------------------------------------
  // app
  // -----------------------------------------------------------------------------
  getPort(): number {
    const port = this.configService.get<string>("PORT");
    return Number(port);
  }

  getDataBaseUrl(): string {
    return this.configService.get<string>("DATABASE_URL");
  }
}
