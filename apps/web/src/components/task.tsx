import { ArrowUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { cn } from "../utils/cn";
import { api } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TaskProps {
  id: string;
  description: string;
  answered: boolean;
  reactions: number;
}

export function Task({ id, answered, description, reactions }: TaskProps) {
  const queryClient = useQueryClient();
  const [hasReacted, setHasReacted] = useState(false);
  const { roomId } = useParams();

  const { mutate } = useMutation({
    mutationFn: () => {
      setHasReacted(!hasReacted);
      return api.patch(`room/${roomId}/ask/${id}/react`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["asks"] });
    },
  });

  return (
    <li className={cn("space-y-3", answered && "opacity-50")}>
      <span className="dark:text-zinc-100">{description}</span>
      <button
        className="text-sm w-fit flex items-center gap-2 dark:text-zinc-100 data-[active=true]:text-orange-400"
        disabled={answered}
        data-active={hasReacted}
        onClick={() => mutate()}
      >
        <ArrowUp className="size-4" />
        Curtir pergunta ({reactions})
      </button>
    </li>
  );
}
