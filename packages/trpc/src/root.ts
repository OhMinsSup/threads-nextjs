import { authRouter } from "./router/auth";
import { reasonsRouter } from "./router/reasons";
import { searchRouter } from "./router/search";
import { tagsRouter } from "./router/tags";
import { threadsRouter } from "./router/threads";
import { usersRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  threads: threadsRouter,
  users: usersRouter,
  tags: tagsRouter,
  search: searchRouter,
  reasons: reasonsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
