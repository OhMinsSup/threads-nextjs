import type { Session } from "@thread/auth";

import { notifyManager } from "./notify-manager";

export class TokenScheduler {
  setSession(session: Session | null) {
    return notifyManager.batch(() => {
      console.log("Setting session", session);
    });
  }
}
