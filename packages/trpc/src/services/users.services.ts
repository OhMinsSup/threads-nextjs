import { remember } from "@epic-web/remember";

export class UsersService {}

export const usersService =
  process.env.NODE_ENV === "development"
    ? new UsersService()
    : remember("usersService", () => new UsersService());
