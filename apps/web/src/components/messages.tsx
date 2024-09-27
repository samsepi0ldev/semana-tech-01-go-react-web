import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Message } from "./message";
import { useMessageWebsockets } from "../hooks/use-message-websocket";
import { getRoomMessages } from "../pages/http/get-messages";

export function Messages() {
  const { roomId } = useParams();

  if (!roomId) {
    throw new Error("Messages components must be used within room page");
  }

  const { data } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getRoomMessages({ roomId }),
  });

  useMessageWebsockets({ roomId });

  if (!data?.messages) return;

  return (
    <ol className="space-y-8 list-decimal px-3">
      {data.messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          description={message.description}
          answered={message.answered}
          reactions={message.reactions}
        />
      ))}
    </ol>
  );
}
