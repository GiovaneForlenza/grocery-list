-- ============================================================
-- Estrutura de banco esperada pelo app (Supabase / Postgres)
-- ============================================================
-- Observações importantes sobre colunas que não estavam no
-- schema original de "itens" mas que o app precisa:
--   - preco: numeric, exibido/editado na Home e no modal
--   - comprar: boolean, controlado pelo checkbox "Comprar" no card
-- Rode os ALTER TABLE abaixo se a tabela "itens" já existir.
-- ============================================================

-- Caso as tabelas ainda não existam:
create table if not exists categorias (
  id bigint generated always as identity primary key,
  nome text not null unique
);

create table if not exists itens (
  id bigint generated always as identity primary key,
  nome text not null,
  categoria text not null references categorias (nome) on update cascade,
  quantidade int4 not null default 0,
  preco numeric(10, 2) not null default 0,
  comprar boolean not null default false,
  foto_url text
);

-- Caso a tabela "itens" já exista sem essas colunas:
alter table itens
  add column if not exists preco numeric(10, 2) not null default 0;
alter table itens
  add column if not exists comprar boolean not null default false;

-- Habilita Row Level Security e permite leitura/escrita pública
-- via a chave "publishable" usada no front-end. Ajuste as
-- políticas conforme a necessidade de autenticação do projeto.
alter table categorias enable row level security;
alter table itens enable row level security;

create policy "Leitura pública de categorias" on categorias
  for select using (true);
create policy "Escrita pública de categorias" on categorias
  for insert with check (true);

create policy "Leitura pública de itens" on itens
  for select using (true);
create policy "Escrita pública de itens" on itens
  for insert with check (true);
create policy "Atualização pública de itens" on itens
  for update using (true) with check (true);
