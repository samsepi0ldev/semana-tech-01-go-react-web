import { api } from "../../lib/api";

export type ResponseMessages = {
  messages: MessageProps[];
};

export type MessageProps = {
  id: string;
  description: string;
  answered: boolean;
  reactions: number;
};

type GetRoomMessagesProps = {
  roomId: string;
};

export async function getRoomMessages({
  roomId,
}: GetRoomMessagesProps): Promise<ResponseMessages> {
  const response = await api.get(`room/${roomId}/asks`);
  console.log(roomId);
  return {
    messages: response.data,
  };
}
