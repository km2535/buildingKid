import { useEffect } from "react";
import "./App.css";
import Location from "./components/Location";

function App() {
  useEffect(() => {
    Location();
  }, []);

  return (
    <div
      id="myMap"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    ></div>
  );
}

export default App;
