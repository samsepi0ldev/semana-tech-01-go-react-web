import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { cn } from "../utils/cn";

import { createMessageReaction } from "../pages/http/create-message-reaction";
import { removeMessageReaction } from "../pages/http/remove-message-reaction";

interface MessageProps {
  id: string;
  description: string;
  answered: boolean;
  reactions: number;
}

export function Message({
  id,
  answered,
  description,
  reactions,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false);
  const { roomId } = useParams();

  if (!roomId) {
    throw new Error("Messages components must be used within room page");
  }

  async function createMessageReactionAction() {
    if (!roomId) return;

    try {
      await createMessageReaction({ roomId, id });
    } catch {
      console.log("Error");
    }

    setHasReacted(true);
  }

  async function removeMessageReactionAction() {
    if (!roomId) return;

    try {
      await removeMessageReaction({ roomId, id });
    } catch {
      console.log("Error");
    }

    setHasReacted(false);
  }

  return (
    <li className={cn("space-y-3", answered && "opacity-50")}>
      <span className="dark:text-zinc-100">{description}</span>
      {hasReacted ? (
        <button
          className="text-sm w-fit flex items-center gap-2 dark:text-zinc-100 data-[active=true]:text-orange-400"
          disabled={answered}
          data-active={hasReacted}
          onClick={removeMessageReactionAction}
          type="button"
        >
          <ThumbsDown className="size-4" />
          Curtir pergunta ({reactions})
        </button>
      ) : (
        <button
          className="text-sm w-fit flex items-center gap-2 dark:text-zinc-100 data-[active=true]:text-orange-400"
          disabled={answered}
          data-active={hasReacted}
          onClick={createMessageReactionAction}
          type="button"
        >
          <ThumbsUp className="size-4" />
          Curtir pergunta ({reactions})
        </button>
      )}
    </li>
  );
}
