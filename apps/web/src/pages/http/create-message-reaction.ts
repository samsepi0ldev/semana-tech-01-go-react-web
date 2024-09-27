import { api } from "../../lib/api";

type RequestCreateMessageReaction = {
  roomId: string;
  id: string;
};

export async function createMessageReaction({
  id,
  roomId,
}: RequestCreateMessageReaction) {
  await api.patch(`room/${roomId}/ask/${id}/react`);
}
