import { useState } from "react";
import { Minus, Plus } from "lucide-react";

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
    <div className="flex items-center justify-between rounded-lg border w-full border-sage bg-paper-dim/70 px-1.5 py-1.5">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => alterar(-1)}
        disabled={quantidade <= 0 || ocupado}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-brick transition hover:bg-brick/10 disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent"
      >
        <Minus size={15} strokeWidth={2.5} />
      </button>

      <span className="min-w-8 text-center font-mono text-sm font-semibold tabular-nums text-ink">
        {quantidade}
      </span>

      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => alterar(1)}
        disabled={ocupado}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-forest transition hover:bg-forest/10 disabled:cursor-not-allowed"
      >
        <Plus size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
