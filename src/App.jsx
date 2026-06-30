import supabase from "./supabase-client";

function App() {
  const item = "Teste";

  const handleClick = async () => {
    const { data, error } = await supabase.from("Categories").select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };

  return (
    <div className="flex border">
      <h1>Grocery list</h1>
      <button onClick={handleClick}>Add item</button>
    </div>
  );
}

export default App;
