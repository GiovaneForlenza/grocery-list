import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ESTADO_VAZIO = { nome: "", categoria: "", quantidade: "0", preco: "" };

export default function EditItemModal({
  item,
  aberto,
  categorias,
  onFechar,
  onSalvar,
  onDeletar,
}) {
  const [form, setForm] = useState(ESTADO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const primeiroCampoRef = useRef(null);

  useEffect(() => {
    if (aberto && item) {
      setForm({
        nome: item.nome ?? "",
        categoria: item.categoria ?? "",
        quantidade: String(item.quantidade ?? 0),
        preco: String(item.preco ?? ""),
      });
      setError(null);
      setConfirmandoExclusao(false);
      setTimeout(() => primeiroCampoRef.current?.focus(), 50);
    }
  }, [aberto, item]);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape" && !confirmandoExclusao) onFechar();
    }
    if (aberto) document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, confirmandoExclusao, onFechar]);

  if (!aberto || !item) return null;

  async function enviar(e) {
    e.preventDefault();
    setError(null);

    if (!form.nome.trim()) return setError("Informe o nome do item.");
    if (!form.categoria) return setError("Selecione uma categoria.");

    setEnviando(true);
    try {
      await onSalvar(item.id, {
        nome: form.nome.trim(),
        categoria: form.categoria,
        quantidade: Number(form.quantidade) || 0,
        preco: Number(form.preco) || 0,
      });
      onFechar();
    } catch (err) {
      setError(err.message || "Não foi possível salvar as alterações.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleConfirmarExclusao() {
    setExcluindo(true);
    try {
      await onDeletar(item.id);
      setConfirmandoExclusao(false);
      onFechar();
    } catch (err) {
      setConfirmandoExclusao(false);
      setError(err.message || "Não foi possível excluir o item.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div
      className="bg-ink/40 fixed inset-0 z-40 flex items-center justify-center px-2 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="animate-pop-in border-sage flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-md border bg-white shadow-xl sm:rounded-3xl">
        <div className="border-sage flex items-center justify-between border-b px-5 py-4">
          <div className="text-forest-dark flex items-center gap-2 text-sm font-medium">
            <Pencil size={15} strokeWidth={2} />
            Editar item
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="text-ink-faint hover:bg-paper-dim hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-3 pt-4 pb-5 sm:px-5">
          {error && (
            <p className="border-brick/30 bg-brick/10 text-brick-dark mb-3 rounded-lg border px-3 py-2 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={enviar} className="flex flex-col gap-4">
            <Campo label="Título">
              <input
                ref={primeiroCampoRef}
                type="text"
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                placeholder="Ex.: Arroz branco 5kg"
                className="campo-input"
              />
            </Campo>

            <Campo label="Categoria">
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoria: e.target.value }))
                }
                className="campo-input"
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {categorias.map((c) => (
                  <option key={c.id ?? c.nome} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Campo label="Quantidade em estoque">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantidade: e.target.value }))
                  }
                  className="campo-input font-mono"
                />
              </Campo>
              <Campo label="Valor (R$)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, preco: e.target.value }))
                  }
                  placeholder="0,00"
                  className="campo-input font-mono"
                />
              </Campo>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="bg-forest text-paper hover:bg-forest-dark mt-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {enviando && (
                <Loader2 size={15} className="animate-spin" strokeWidth={2.5} />
              )}
              Salvar alterações
            </button>

            <button
              type="button"
              onClick={() => setConfirmandoExclusao(true)}
              className="text-brick hover:bg-brick/10 flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition"
            >
              <Trash2 size={15} strokeWidth={2} />
              Deletar produto
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        aberto={confirmandoExclusao}
        titulo="Excluir produto?"
        mensagem={`Isso vai remover "${item.nome}" do estoque permanentemente. Essa ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        carregando={excluindo}
        perigoso
        onConfirmar={handleConfirmarExclusao}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-ink-faint text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
