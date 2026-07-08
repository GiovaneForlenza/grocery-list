import { useEffect, useRef, useState } from "react";
import { Loader2, Package, Tag, X } from "lucide-react";

const ITEM_VAZIO = {
  nome: "",
  categoria: "",
  quantidade: "1",
  preco: "",
  photo_url: "",
};

export default function AddItemModal({
  aberto,
  categorias,
  onFechar,
  onAddItem,
  onAddCategoria,
}) {
  const [aba, setAba] = useState("item");
  const [formItem, setFormItem] = useState(ITEM_VAZIO);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const primeiroCampoRef = useRef(null);

  useEffect(() => {
    if (aberto) {
      setAba("item");
      setFormItem(ITEM_VAZIO);
      setNomeCategoria("");
      setError(null);
      setTimeout(() => primeiroCampoRef.current?.focus(), 50);
    }
  }, [aberto]);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") onFechar();
    }
    if (aberto) document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  async function enviarItem(e) {
    e.preventDefault();
    setError(null);

    if (!formItem.nome.trim()) return setError("Inform o nome do item.");
    if (!formItem.categoria) return setError("Selecione uma categoria.");

    setEnviando(true);
    try {
      await onAddItem({
        nome: formItem.nome.trim(),
        categoria: formItem.categoria,
        quantidade: Number(formItem.quantidade) || 0,
        preco: Number(formItem.preco) || 0,
        photo_url: formItem.photo_url.trim() || null,
      });
      onFechar();
    } catch (err) {
      setError(err.message || "Não foi possível salvar o item.");
    } finally {
      setEnviando(false);
    }
  }

  async function enviarCategoria(e) {
    e.preventDefault();
    setError(null);

    setEnviando(true);
    try {
      const nova = await onAddCategoria(nomeCategoria);
      setNomeCategoria("");
      setFormItem((f) => ({ ...f, categoria: nova.nome }));
      setAba("item");
    } catch (err) {
      setError(err.message || "Não foi possível salvar a categoria.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex  justify-center bg-ink/40 backdrop-blur-sm items-center px-2"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="animate-pop-in flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-sage bg-white shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-sage px-5 pt-5">
          <div className="flex gap-1 flex-col sm:flex-row w-full">
            <button
              type="button"
              onClick={() => setAba("item")}
              className={`flex items-center gap-1.5 sm:rounded-t-xl rounded-md px-3.5 py-2.5 text-sm font-medium transition ${
                aba === "item"
                  ? "border  border-sage bg-white text-forest-dark border-b sm:border-b-0"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Package size={15} strokeWidth={2} />
              Novo item
            </button>
            <button
              type="button"
              onClick={() => setAba("categoria")}
              className={`flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-sm font-medium transition ${
                aba === "categoria"
                  ? "border  border-sage bg-white text-forest-dark border-b sm:border-b-0"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Tag size={15} strokeWidth={2} />
              Nova categoria
            </button>
          </div>

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="-mt-1 flex h-8 w-16 shrink-0 items-center justify-center rounded-full text-ink-faint transition hover:bg-paper-dim hover:text-ink"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-3 sm:px-5 pb-5 pt-4">
          {error && (
            <p className="mb-3 rounded-lg border border-brick/30 bg-brick/10 px-3 py-2 text-sm text-brick-dark">
              {error}
            </p>
          )}

          {aba === "item" ? (
            <form onSubmit={enviarItem} className="flex flex-col gap-4">
              <Campo label="Nome do item">
                <input
                  ref={primeiroCampoRef}
                  type="text"
                  value={formItem.nome}
                  onChange={(e) =>
                    setFormItem((f) => ({ ...f, nome: e.target.value }))
                  }
                  placeholder="Ex.: Arroz branco 5kg"
                  className="campo-input"
                />
              </Campo>

              <Campo label="Categoria">
                {categorias.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-sage-dark/60 bg-paper-dim px-3 py-2.5 text-sm text-ink-faint">
                    Nenhuma categoria cadastrada.{" "}
                    <button
                      type="button"
                      onClick={() => setAba("categoria")}
                      className="font-medium text-forest underline underline-offset-2"
                    >
                      Criar uma agora
                    </button>
                  </p>
                ) : (
                  <select
                    value={formItem.categoria}
                    onChange={(e) =>
                      setFormItem((f) => ({ ...f, categoria: e.target.value }))
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
                )}
              </Campo>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Quantidade">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formItem.quantidade}
                    onChange={(e) =>
                      setFormItem((f) => ({ ...f, quantidade: e.target.value }))
                    }
                    className="campo-input font-mono"
                  />
                </Campo>
                <Campo label="Preço (R$)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formItem.preco}
                    onChange={(e) =>
                      setFormItem((f) => ({ ...f, preco: e.target.value }))
                    }
                    placeholder="0,00"
                    className="campo-input font-mono"
                  />
                </Campo>
              </div>

              <Campo label="URL da photo (opcional)">
                <input
                  type="url"
                  value={formItem.photo_url}
                  onChange={(e) =>
                    setFormItem((f) => ({ ...f, photo_url: e.target.value }))
                  }
                  placeholder="https://…"
                  className="campo-input"
                />
              </Campo>

              <BotaoSalvar enviando={enviando} texto="Salvar item" />
            </form>
          ) : (
            <form onSubmit={enviarCategoria} className="flex flex-col gap-4">
              <Campo label="Nome da categoria">
                <input
                  type="text"
                  value={nomeCategoria}
                  onChange={(e) => setNomeCategoria(e.target.value)}
                  placeholder="Ex.: Hortifruti"
                  className="campo-input"
                  autoFocus
                />
              </Campo>
              <BotaoSalvar enviando={enviando} texto="Salvar categoria" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

function BotaoSalvar({ enviando, texto }) {
  return (
    <button
      type="submit"
      disabled={enviando}
      className="mt-1 flex items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {enviando && (
        <Loader2 size={15} className="animate-spin" strokeWidth={2.5} />
      )}
      {texto}
    </button>
  );
}
