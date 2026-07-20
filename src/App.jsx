import { Loader2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import Header from "./components/Header";
import ItemGrid from "./components/ItemGrid";
import Toast from "./components/Toast";
import { useCategories } from "./hooks/useCategories";
import { useItems } from "./hooks/useItems";

export default function App() {
  const {
    itens,
    loading: carregandoItens,
    error: erroItens,
    addItem,
    updateItem,
    deleteItem,
    updateQuantidade,
    updatePrecisaComprar,
    updateComprando,
    finalizarCompra,
  } = useItems();
  const {
    categorias,
    loading: carregandoCategorias,
    error: erroCategorias,
    addCategoria,
  } = useCategories();

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("nome-asc");
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [toast, setToast] = useState(null);

  function mostrarToast(mensagem, tipo = "sucesso") {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 2600);
  }

  const itensFiltrados = useMemo(() => {
    let lista = itens;
    if (categoriaAtiva === "Precisa comprar") {
      lista = lista.filter((item) => item.precisa_comprar);
    } else if (categoriaAtiva !== "Todos") {
      lista = lista.filter((item) => item.categoria === categoriaAtiva);
    }

    const termo = busca.trim().toLowerCase();
    if (termo) {
      lista = lista.filter((item) => item.nome.toLowerCase().includes(termo));
    }

    const ordenada = [...lista];
    switch (ordenacao) {
      case "categoria-asc":
        ordenada.sort((a, b) => {
          const porCategoria = a.categoria.localeCompare(b.categoria, "pt-BR");
          return porCategoria !== 0
            ? porCategoria
            : a.nome.localeCompare(b.nome, "pt-BR");
        });
        break;
      case "quantidade-desc":
        ordenada.sort((a, b) => b.quantidade - a.quantidade);
        break;
      case "quantidade-asc":
        ordenada.sort((a, b) => a.quantidade - b.quantidade);
        break;
      case "nome-asc":
      default:
        ordenada.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    }
    return ordenada;
  }, [itens, categoriaAtiva, busca, ordenacao]);

  async function handleAlterarQuantidade(id, novoValor) {
    try {
      await updateQuantidade(id, novoValor);
    } catch (err) {
      mostrarToast(
        err.message || "Não foi possível atualizar a quantidade.",
        "erro",
      );
    }
  }

  async function handleAlterarComprar(id, novoValor) {
    try {
      await updatePrecisaComprar(id, novoValor);
    } catch (err) {
      mostrarToast(err.message || "Não foi possível atualizar o item.", "erro");
    }
  }

  async function handleAlterarComprando(id, novoValor) {
    try {
      await updateComprando(id, novoValor);
    } catch (err) {
      mostrarToast(err.message || "Não foi possível atualizar o item.", "erro");
    }
  }

  async function handleFinalizarCompra() {
    try {
      await finalizarCompra();
      mostrarToast("Itens do carrinho marcados como comprados.");
    } catch (err) {
      mostrarToast(
        err.message || "Não foi possível finalizar a compra.",
        "erro",
      );
    }
  }

  async function handleAddItem(novoItem) {
    await addItem(novoItem);
    mostrarToast(`"${novoItem.nome}" adicionado ao estoque.`);
  }

  async function handleSalvarEdicao(id, dadosAtualizados) {
    await updateItem(id, dadosAtualizados);
    mostrarToast(`"${dadosAtualizados.nome}" atualizado.`);
  }

  async function handleDeletarItem(id) {
    const item = itens.find((i) => i.id === id);
    await deleteItem(id);
    mostrarToast(`"${item?.nome ?? "Item"}" excluído do estoque.`);
  }

  async function handleAddCategoria(nome) {
    const categoria = await addCategoria(nome);
    mostrarToast(`Categoria "${categoria.nome}" criada.`);
    return categoria;
  }

  const carregando = carregandoItens || carregandoCategorias;
  const erro = erroItens || erroCategorias;

  return (
    <div className="bg-paper min-h-screen">
      <Header
        onNovoItem={() => setModalAberto(true)}
        valorSearch={busca}
        onChangeSearch={setBusca}
        categorias={categorias}
        categoriaAtiva={categoriaAtiva}
        onSelecionar={setCategoriaAtiva}
        valorOrdenacao={ordenacao}
        onChangeOrdenacao={setOrdenacao}
      />
      <Toast toast={toast} />

      <main className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {/* <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter
            categorias={categorias}
            categoriaAtiva={categoriaAtiva}
            onSelecionar={setCategoriaAtiva}
          />
          <SortDropdown valor={ordenacao} onChange={setOrdenacao} />
        </div> */}
        {erro && (
          <div className="border-brick/30 bg-brick/10 text-brick-dark mb-5 flex items-start gap-2 rounded-md border px-2 py-3 text-sm">
            <TriangleAlert
              size={17}
              className="mt-0.5 shrink-0"
              strokeWidth={2}
            />
            <span>
              Erro ao conectar com o Supabase: {erro}. Verifique as variáveis de
              ambiente e se as tabelas <code className="font-mono">itens</code>{" "}
              e <code className="font-mono">categorias</code> existem.
            </span>
          </div>
        )}
        {carregando ? (
          <div className="text-ink-faint flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 size={26} className="animate-spin" strokeWidth={2} />
            <p className="text-sm">Carregando itens…</p>
          </div>
        ) : (
          <ItemGrid
            itens={itensFiltrados}
            categoriaAtiva={categoriaAtiva}
            onAlterarQuantidade={handleAlterarQuantidade}
            onAlterarComprar={handleAlterarComprar}
            onAlterarComprando={handleAlterarComprando}
            onFinalizarCompra={handleFinalizarCompra}
            onEditar={setItemEmEdicao}
          />
        )}
      </main>

      <AddItemModal
        aberto={modalAberto}
        categorias={categorias}
        onFechar={() => setModalAberto(false)}
        onAddItem={handleAddItem}
        onAddCategoria={handleAddCategoria}
      />

      <EditItemModal
        aberto={!!itemEmEdicao}
        item={itemEmEdicao}
        categorias={categorias}
        onFechar={() => setItemEmEdicao(null)}
        onSalvar={handleSalvarEdicao}
        onDeletar={handleDeletarItem}
      />
    </div>
  );
}
