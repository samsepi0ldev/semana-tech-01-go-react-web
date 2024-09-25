import { ArrowUp } from "lucide-react";
import { cn } from "../utils/cn";
import { useState } from "react";

interface TaskProps {
  description: string;
  answered: boolean;
  reactions: number;
}

export function Task({ answered, description, reactions }: TaskProps) {
  const [hasReacted, setHasReacted] = useState(false);

  return (
    <li className={cn("space-y-3", answered && "opacity-50")}>
      <span className="dark:text-zinc-100">{description}</span>
      <button
        className="text-sm w-fit flex items-center gap-2 dark:text-zinc-100 data-[active=true]:text-orange-400"
        disabled={answered}
        data-active={hasReacted}
        onClick={() => setHasReacted(!hasReacted)}
      >
        <ArrowUp className="size-4" />
        Curtir pergunta ({reactions})
      </button>
    </li>
  );
}
