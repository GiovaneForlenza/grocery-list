import supabase from "./supabase-client";

function App() {
  const item = "Teste";

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("Categories")
      .insert({ name: item });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };

  const hangleGet = async () => {
    const { data, error } = await supabase.from("Categories").select();
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };

  return (
    <div className="border">
      <h1>Grocery list</h1>
      <button onClick={handleAdd} className="rounded-sm border px-4 py-2">
        Add item
      </button>
      <button onClick={hangleGet} className="rounded-sm border px-4 py-2">
        Get items
      </button>
    </div>
  );
}

export default App;
