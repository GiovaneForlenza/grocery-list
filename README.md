# Market — Inventory Control

React (Vite) + Tailwind CSS v4 app connected to Supabase for managing grocery items: a product grid with photo, category, price and quantity (with +/- buttons that update the database in real time), category filter, sorting by name/quantity, and a modal for registering new items and categories.

## Running the project

```bash
npm install
npm run dev
```

The `.env` file is already set up with the Supabase URL and publishable key provided. If you need to change it, edit `.env` (`VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` variables).

## Database

See `supabase.sql` for the reference SQL. **Important:** the original `itens` schema didn't have a price column, but the Home screen displays a price per item — the script includes `alter table itens add column preco numeric(10,2)`. Run this SQL in the Supabase SQL editor before using the app.

> Note: the actual Supabase tables/columns (`itens`, `categorias`, `nome`, `categoria`, `quantidade`, `preco`, `foto_url`, `precisa_comprar`, `comprando`) are still named in Portuguese, since that's what the live database uses. The application code reads/writes those exact field names when talking to Supabase, even though all UI text, comments, and internal variable/function names have been translated to English.

It also includes basic RLS (Row Level Security) policies that open up public read/write access, compatible with using the `publishable` key on the front end. Adjust these to fit your project's authentication needs.

## Structure

```
src/
  lib/supabaseClient.js     Supabase client
  hooks/useItems.js         fetches items + optimistic quantity updates
  hooks/useCategories.js    fetches and creates categories
  components/
    Header.jsx              top bar with title, search, filters and "New item" button
    CategoryFilter.jsx      category filter pills
    SortDropdown.jsx        styled sort dropdown (name / quantity)
    ItemGrid.jsx / ItemCard.jsx  responsive grid and "price tag" style card
    QuantityStepper.jsx     +/- buttons that write to Supabase
    AddItemModal.jsx        modal with "New item" / "New category" tabs
    EditItemModal.jsx       modal for editing or deleting an item
    ConfirmDialog.jsx       reusable confirmation dialog
    SearchBar.jsx           live search input
    Toast.jsx               success/error feedback
    ScrollToTop.jsx         floating scroll-to-top button
```

## Responsiveness

The grid adapts from 2 columns (mobile) up to 5 columns (large desktop), with horizontally scrollable filters on narrow screens.

## Build

```bash
npm run build
npm run preview
```
