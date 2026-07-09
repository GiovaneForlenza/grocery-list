import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  carregando = false,
  perigoso = false,
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape" && !carregando) onCancelar();
    }
    if (aberto) document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, carregando, onCancelar]);

  if (!aberto) return null;

  return (
    <div
      className="bg-ink/50 fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !carregando) onCancelar();
      }}
    >
      <div className="animate-pop-in border-sage w-full max-w-sm rounded-2xl border bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              perigoso ? "bg-brick/10 text-brick" : "bg-forest/10 text-forest"
            }`}
          >
            <AlertTriangle size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-ink text-base font-semibold">
              {titulo}
            </h2>
            <p className="text-ink-soft mt-1 text-sm">{mensagem}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={carregando}
            className="border-sage-dark/60 text-ink-soft hover:bg-paper-dim rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
              perigoso
                ? "bg-brick hover:bg-brick-dark"
                : "bg-forest hover:bg-forest-dark"
            }`}
          >
            {carregando && (
              <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
            )}
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
