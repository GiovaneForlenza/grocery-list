import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function QuantityStepper({ quantity, onChange }) {
  const [busy, setBusy] = useState(false);

  async function change(delta) {
    const newValue = quantity + delta;
    if (newValue < 0 || busy) return;
    setBusy(true);
    try {
      await onChange(newValue);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-sage bg-paper-dim/70 flex w-full items-center justify-between rounded-sm border px-1.5 py-1.5">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => change(-1)}
        disabled={quantity <= 0 || busy}
        className="text-brick hover:bg-brick/10 disabled:text-ink-faint flex h-7 w-7 items-center justify-center rounded-sm transition disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Minus size={15} strokeWidth={2.5} />
      </button>

      <span className="text-ink min-w-8 text-center font-mono text-sm font-semibold tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => change(1)}
        disabled={busy}
        className="text-forest hover:bg-forest/10 flex h-7 w-7 items-center justify-center rounded-md transition disabled:cursor-not-allowed"
      >
        <Plus size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
