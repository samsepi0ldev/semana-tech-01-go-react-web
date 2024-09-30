import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import type { ResponseMessages } from "../pages/http/get-messages";

interface UseMessageWebsocketsProps {
  roomId?: string;
}

type WebsocketHook = {
  kind: string;
  value: {
    id: string;
    description: string;
    reactions: number;
    answered: boolean;
    roomId: string;
  };
};

export function useMessageWebsockets({ roomId }: UseMessageWebsocketsProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/subscribe/${roomId}`);

    ws.onopen = () => {
      console.log("Websocket Connected!");
    };

    ws.onclose = () => {
      console.log("Websocket connection closed!");
    };

    ws.onmessage = (event) => {
      const data: WebsocketHook = JSON.parse(event.data);
      switch (data.kind) {
        case "message_created":
          queryClient.setQueryData<ResponseMessages>(
            ["messages", roomId],
            (state) => {
              return {
                messages: [
                  ...(state?.messages ?? []),
                  {
                    id: data.value.id,
                    description: data.value.description,
                    reactions: data.value.reactions,
                    answered: data.value.answered,
                    roomId: data.value.roomId,
                  },
                ],
              };
            },
          );
          break;
        case "message_answered":
          queryClient.setQueryData<ResponseMessages>(
            ["messages", roomId],
            (state) => {
              if (!state) {
                return undefined;
              }
              return {
                messages: state.messages.map((item) => {
                  if (item.id === data.value.id) {
                    return { ...item, answered: data.value.answered };
                  }

                  return item;
                }),
              };
            },
          );
          break;
        case "message_reaction_increased":
        case "message_reaction_decreased":
          queryClient.setQueryData<ResponseMessages>(
            ["messages", roomId],
            (state) => {
              if (!state) {
                return undefined;
              }
              return {
                messages: state.messages.map((item) => {
                  if (item.id === data.value.id) {
                    return { ...item, reactions: data.value.reactions };
                  }

                  return item;
                }),
              };
            },
          );
          break;
      }
    };
    return () => {
      ws.close();
    };
  }, [queryClient, roomId]);
}
