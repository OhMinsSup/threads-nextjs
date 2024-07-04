import React from "react";

import { ThreadArea } from "~/components/threads/ThreadArea";
import { ThreadForm } from "~/components/threads/ThreadForm";
import { ThreadHeader } from "~/components/threads/ThreadHeader";

export default function Page() {
  return (
    <>
      <ThreadHeader />
      <ThreadArea>
        <div className="px-4 py-2">
          <ThreadForm />
        </div>
      </ThreadArea>
    </>
  );
}
