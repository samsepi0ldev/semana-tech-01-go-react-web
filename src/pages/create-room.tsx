import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.svg";

export function CreateRoom() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[450px] flex flex-col gap-6 items-center justify-center">
        <img src={logo} alt="AMA" />

        <p className="text-center">
          Crie uma sala pública de AMA (Ask me anything) e priorize as perguntas
          mais importantes para a comunidade.
        </p>

        <div className="w-full flex items-center rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 p-2 ring-2 ring-transparent ring-offset-4 ring-offset-zinc-950 focus-within:ring-orange-400">
          <input
            className="flex-1 bg-transparent text-sm outline-none pl-2 placeholder-zinc-500"
            placeholder="Nome da sala"
            type="text"
          />
          <button className="text-sm font-medium flex items-center justify-center py-1.5 px-3 gap-1.5 bg-orange-400 text-orange-950 rounded-lg outline-none ring-2 ring-transparent ring-offset-2 ring-offset-zinc-900 focus:ring-orange-400">
            Criar sala
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
