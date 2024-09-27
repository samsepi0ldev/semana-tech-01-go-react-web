import { api } from "../../lib/api";

type RequestCreateRoom = {
  title: string;
};

export async function createRoom({ title }: RequestCreateRoom) {
  const response = await api.post("rooms", { title });

  return response.data;
}
