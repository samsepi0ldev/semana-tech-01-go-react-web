import { api } from "../../lib/api";

type RequestRemoveMessageReaction = {
  roomId: string;
  id: string;
};

export async function removeMessageReaction({
  id,
  roomId,
}: RequestRemoveMessageReaction) {
  await api.patch(`room/${roomId}/ask/${id}/un-react`);
}
