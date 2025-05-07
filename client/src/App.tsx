import { useState } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";

function App() {
  const [userName, setUserName] = useState("");

  if (userName)
    return <Home userName={userName} onLogout={() => setUserName("")} />;
  return <Login onSubmit={setUserName} />;
}

export default App;
