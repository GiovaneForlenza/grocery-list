# Mercado — Controle de Estoque

App React (Vite) + Tailwind CSS v4 conectado ao Supabase para gerenciar itens de mercado: grid de produtos com foto, categoria, preço e quantidade (com botões +/- que atualizam o banco em tempo real), filtro por categoria, ordenação por nome/quantidade e um modal para cadastrar novos itens e categorias.

## Rodando o projeto

```bash
npm install
npm run dev
```

O `.env` já está configurado com a URL e a chave publicável do Supabase informadas. Se precisar trocar, edite `.env` (variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`).

## Banco de dados

Veja `supabase.sql` para o SQL de referência. **Importante:** o schema original de `itens` não tinha coluna de preço, mas a Home exibe preço por item — o script inclui o `alter table itens add column preco numeric(10,2)`. Rode esse SQL no editor SQL do Supabase antes de usar o app.

Também inclui políticas de RLS (Row Level Security) básicas liberando leitura/escrita pública, compatíveis com o uso da chave `publishable` no front-end. Ajuste conforme a necessidade de autenticação do seu projeto.

## Estrutura

```
src/
  lib/supabaseClient.js     cliente Supabase
  hooks/useItems.js         busca itens + atualização otimista de quantidade
  hooks/useCategories.js    busca e cria categorias
  components/
    Header.jsx              topo com título e botão "Novo item"
    CategoryFilter.jsx       pílulas de filtro por categoria
    SortDropdown.jsx        dropdown estilizado (nome / quantidade)
    ItemGrid.jsx / ItemCard.jsx  grid responsivo e card no estilo "etiqueta"
    QuantityStepper.jsx     botões +/- que gravam no Supabase
    AddItemModal.jsx        modal com abas "Novo item" / "Nova categoria"
    Toast.jsx               feedback de sucesso/erro
```

## Responsividade

Grid adapta de 2 colunas (mobile) até 5 colunas (desktop grande), com filtros roláveis horizontalmente em telas estreitas.

## Build

```bash
npm run build
npm run preview
```
