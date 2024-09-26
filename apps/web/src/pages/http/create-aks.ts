import { api } from "../../lib/api";

type AskRequest = {
  description: string;
  roomId: string;
};

export async function createAsk({ description, roomId }: AskRequest) {
  await api.post(`/room/${roomId}/asks`, {
    description,
  });
}
