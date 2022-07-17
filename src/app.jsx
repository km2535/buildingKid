import { useEffect, useState } from "react";
import "./App.css";
import Location from "./components/Location";
import Search from "./components/search/search";

function App() {
  const [search, setSearch] = useState("");
  useEffect(() => {
    Location(search);
  }, [search]);

  return (
    <>
      <Search setSearch={setSearch} />
      <div
        id="myMap"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      ></div>
    </>
  );
}

export default App;
