import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";

import { createAsk } from "../pages/http/create-aks";
import { toast } from "sonner";

const askSchema = z.object({
  description: z.string().min(1),
});

type CreateAskSchema = z.infer<typeof askSchema>

export function MessageForm() {
  const { roomId } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateAskSchema>({
    resolver: zodResolver(askSchema)
  });

  function handleCreateAsk({ description }: CreateAskSchema) {
    if (roomId) {
      try {
        createAsk({ description, roomId });
        toast.success('Mensagem criada com sucesso!')
      } catch (error) {
        toast.error('Erro ao tentar criar mensagem tente novamente!')
      }
      reset();
    }
  }

	return (
		<>
			<form
				onSubmit={handleSubmit(handleCreateAsk)}
				className="w-full flex items-center rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 p-2 ring-2 ring-transparent ring-offset-4 ring-offset-zinc-950 focus-within:ring-orange-400"
			>
				<input
					className="text-sm flex-1 bg-transparent outline-none pl-2 placeholder-zinc-500"
					placeholder="Nome da sala"
					type="text"
					{...register("description")}
				/>
				<button
					type="submit"
					className="text-sm font-medium flex items-center justify-center py-1.5 px-3 gap-1.5 bg-orange-400 text-orange-950 rounded-lg outline-none ring-2 ring-transparent ring-offset-2 ring-offset-zinc-900 focus:ring-orange-400"
				>
					Criar pergunta
					<ArrowRight className="size-4" />
				</button>
			</form>
			{errors.description && (
				<span className="text-red-400 my-10 block">
					{errors.description?.message}
				</span>
			)}
		</>
	);
}
