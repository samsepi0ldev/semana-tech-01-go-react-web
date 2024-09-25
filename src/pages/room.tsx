import { ArrowRight, ArrowUp, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";

export function Room() {
  let { roomId } = useParams();
  return (
    <div className="w-full h-screen pt-10">
      <div className="w-full max-w-[640px] space-y-6 mx-auto">
        <div className="flex items-center justify-between gap-3 px-3 py-1 text-sm">
          <svg
            width="27"
            height="21"
            viewBox="0 0 27 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3101_464)">
              <path
                d="M9.68549 9.61254C10.1032 8.74462 10.5222 7.87713 10.9381 7.00834C11.3653 6.11523 11.7782 5.21518 12.2202 4.32989C12.4469 3.87531 12.5407 3.41074 12.5137 2.90796C12.4334 1.4209 11.2003 0.349343 9.72978 0.535172C8.49454 0.691476 7.62184 1.39832 7.05177 2.47508C6.68054 3.17585 6.36229 3.9044 6.02363 4.62209C5.71015 5.28682 5.37019 5.93939 5.09015 6.61975C5.05628 6.68314 5.01981 6.74566 4.98898 6.81035C4.17707 8.50799 3.36168 10.2039 2.55628 11.9041C1.78258 13.5366 1.02059 15.1748 0.25036 16.8091C0.0410856 17.2532 -0.0292513 17.7165 0.0115614 18.2023C0.128355 19.583 1.30845 20.5977 2.6848 20.4744C3.9869 20.3576 4.88695 19.6243 5.43445 18.4889C6.28805 16.7187 7.12471 14.9395 7.97743 13.1689C8.54795 11.984 9.11628 10.7983 9.68549 9.61298V9.61254Z"
                fill="#FB923C"
              />
              <path
                d="M26.0537 16.5425C25.5422 15.5004 25.0481 14.4493 24.5466 13.4025C24.3512 12.9948 24.1546 12.5875 23.9587 12.1803C23.6322 11.4904 23.3079 10.7991 22.9792 10.1101C22.0466 8.15673 21.1118 6.20466 20.1779 4.25216C19.9048 3.68078 19.6252 3.11201 19.3604 2.53672C19.0152 1.78733 18.4898 1.2064 17.76 0.822587C16.7062 0.268141 15.5009 0.44051 14.6686 1.24982C13.8828 2.01354 13.6891 3.17757 14.1754 4.18921C15.4562 6.8555 16.7336 9.52309 18.0153 12.1885C18.4316 13.0543 18.8567 13.9157 19.2779 14.7793C19.2826 14.8001 19.2835 14.8231 19.2926 14.8422C19.894 16.1157 20.4797 17.3969 21.1036 18.6591C21.4926 19.4462 22.12 20.0076 22.9527 20.3107C24.3538 20.8209 25.8131 20.1592 26.2551 18.8141C26.5121 18.0317 26.4153 17.2784 26.0541 16.5425H26.0537Z"
                fill="#FB923C"
              />
              <path
                d="M13.2958 6.35358C13.2732 6.30755 13.2697 6.23591 13.1768 6.23722C12.7891 7.03089 12.3953 7.82674 12.0106 8.6265C11.5821 9.51787 11.1618 10.4131 10.7376 11.3067C10.7228 11.3314 10.7055 11.3549 10.6933 11.3809C9.83449 13.1941 8.97352 15.0059 8.11862 16.8212C7.92845 17.2254 7.84161 17.6557 7.85247 18.1055C7.88763 19.5717 9.15109 20.6684 10.5986 20.4787C11.7206 20.332 12.5069 19.6915 13.0887 18.7589C13.2493 18.5015 13.3544 18.2166 13.4829 17.9435C13.7873 17.2962 14.0864 16.6466 14.3873 15.998C14.9977 14.7918 15.5083 13.5388 16.1049 12.3261C16.1501 12.2341 16.1223 12.1638 16.0832 12.083C15.1536 10.1735 14.2258 8.26309 13.2962 6.35401L13.2958 6.35358Z"
                fill="#FB923C"
              />
            </g>
            <defs>
              <clipPath id="clip0_3101_464">
                <rect
                  width="26.3994"
                  height="20"
                  fill="white"
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>

          <span className="flex-1 dark:text-zinc-500">
            Codigo da sala: <span className="dark:text-zinc-300">{roomId}</span>
          </span>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg dark:bg-zinc-800 dark:text-zinc-300">
            Compartilhar
            <Share2 className="size-4" />
          </button>
        </div>

        <hr className="w-full h-px dark:border-zinc-900" />

        <div className="w-full flex items-center rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 p-2 ring-2 ring-transparent ring-offset-4 ring-offset-zinc-950 focus-within:ring-orange-400">
          <input
            className="text-sm flex-1 bg-transparent outline-none pl-2 placeholder-zinc-500"
            placeholder="Nome da sala"
            type="text"
          />
          <button className="text-sm font-medium flex items-center justify-center py-1.5 px-3 gap-1.5 bg-orange-400 text-orange-950 rounded-lg outline-none ring-2 ring-transparent ring-offset-2 ring-offset-zinc-900 focus:ring-orange-400">
            Criar pergunta
            <ArrowRight className="size-4" />
          </button>
        </div>

        <ul className="space-y-8 list-decimal">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="space-y-3">
              <span className="dark:text-zinc-100">
                O que é GoLang e quais são suas principais vantagens em
                comparação com outras linguagens de programação como Python,
                Java ou C++?
              </span>
              <button className="text-sm w-fit flex items-center gap-2 text-orange-400">
                <ArrowUp className="size-4" />
                Curtir pergunta (182)
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
