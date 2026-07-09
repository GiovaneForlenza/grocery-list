import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function QuantityStepper({ quantidade, onAlterar }) {
  const [ocupado, setOcupado] = useState(false);

  async function alterar(delta) {
    const novoValor = quantidade + delta;
    if (novoValor < 0 || ocupado) return;
    setOcupado(true);
    try {
      await onAlterar(novoValor);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="border-sage bg-paper-dim/70 flex w-full items-center justify-between rounded-sm border px-1.5 py-1.5">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => alterar(-1)}
        disabled={quantidade <= 0 || ocupado}
        className="text-brick hover:bg-brick/10 disabled:text-ink-faint flex h-7 w-7 items-center justify-center rounded-sm transition disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Minus size={15} strokeWidth={2.5} />
      </button>

      <span className="text-ink min-w-8 text-center font-mono text-sm font-semibold tabular-nums">
        {quantidade}
      </span>

      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => alterar(1)}
        disabled={ocupado}
        className="text-forest hover:bg-forest/10 flex h-7 w-7 items-center justify-center rounded-md transition disabled:cursor-not-allowed"
      >
        <Plus size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
