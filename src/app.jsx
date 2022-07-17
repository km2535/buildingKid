import { useEffect, useState } from "react";
import "./App.css";
import Location from "./components/Location";
import Search from "./components/search/search";
import Type from "./components/type/type";

function App() {
  const [type, setType] = useState({
    terrain: false,
    traffic: false,
    bicycle: false,
    district: false,
  });
  const typemethodHandler = (e) => {
    const newType = { ...type };
    for (const key in newType) {
      if (key === e.target.id) {
        newType[key] = e.target.checked;
      }
    }
    setType(newType);
  };
  const [search, setSearch] = useState(null);
  useEffect(() => {
    Location(search, type);
  }, [search, type]);

  return (
    <>
      <Search setSearch={setSearch} />
      <Type typeHandle={typemethodHandler} />
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
