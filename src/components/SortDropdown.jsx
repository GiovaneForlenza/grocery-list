import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  Tags,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OPCOES = [
  { valor: "nome-asc", rotulo: "Nome (A → Z)", icon: ArrowDownAZ },
  { valor: "categoria-asc", rotulo: "Categoria (A → Z)", icon: Tags },
  {
    valor: "quantidade-desc",
    rotulo: "Quantidade (maior → menor)",
    icon: ArrowDownWideNarrow,
  },
  {
    valor: "quantidade-asc",
    rotulo: "Quantidade (menor → maior)",
    icon: ArrowDownWideNarrow,
  },
];

export default function SortDropdown({ valor, onChange }) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);
  const atual = OPCOES.find((o) => o.valor === valor) ?? OPCOES[0];

  useEffect(() => {
    function aoClicarFora(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  return (
    <div ref={containerRef} className="relative z-20 shrink-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        className="border-sage-dark/60 text-ink-soft hover:border-forest-light hover:text-forest flex w-full items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm transition sm:w-fit sm:items-start"
      >
        <atual.icon size={15} strokeWidth={2} />
        <span className="hidden md:inline">Ordenar:</span>
        <span className="text-ink">{atual.rotulo}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`text-ink-faint transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <ul
          role="listbox"
          className="animate-pop-in border-sage top-30 right-0 z-20 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border bg-white py-1.5 shadow-lg"
        >
          {OPCOES.map((opcao) => {
            const selecionado = opcao.valor === valor;
            return (
              <li key={opcao.valor}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opcao.valor);
                    setAberto(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                    selecionado
                      ? "bg-sage/50 text-forest-dark font-medium"
                      : "text-ink-soft hover:bg-paper-dim"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <opcao.icon size={15} strokeWidth={2} />
                    {opcao.rotulo}
                  </span>
                  {selecionado && <Check size={15} strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
